using HeroscapeBuilder.Server.Services;

namespace HeroscapeBuilder.Server.Common.Jobs
{
    public class ThumbnailRebuildStatus
    {
        public bool Running { get; set; }
        public int Total { get; set; }
        public int Processed { get; set; }
        public int Succeeded { get; set; }
        public int Failed { get; set; }
        public string? Current { get; set; }
        public DateTime? StartedAtUtc { get; set; }
        public DateTime? FinishedAtUtc { get; set; }
        public List<string> Errors { get; set; } = new();
    }

    /// <summary>
    /// Rebuilds every PDF thumbnail in the background (one at a time) so the request that starts it returns immediately.
    /// Registered as a singleton; each unit of work gets its own DI scope so the DbContext never grows.
    /// </summary>
    public class ThumbnailRebuildJob
    {
        private const int MaxReportedErrors = 100;

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ThumbnailRebuildJob> _logger;
        private readonly object _lock = new();
        private ThumbnailRebuildStatus _status = new();

        public ThumbnailRebuildJob(IServiceScopeFactory scopeFactory, ILogger<ThumbnailRebuildJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        public ThumbnailRebuildStatus GetStatus()
        {
            lock (_lock)
            {
                return new ThumbnailRebuildStatus
                {
                    Running = _status.Running,
                    Total = _status.Total,
                    Processed = _status.Processed,
                    Succeeded = _status.Succeeded,
                    Failed = _status.Failed,
                    Current = _status.Current,
                    StartedAtUtc = _status.StartedAtUtc,
                    FinishedAtUtc = _status.FinishedAtUtc,
                    Errors = _status.Errors.ToList(),
                };
            }
        }

        /// <summary>Returns false if a rebuild is already running.</summary>
        public bool TryStart()
        {
            lock (_lock)
            {
                if (_status.Running) return false;
                _status = new ThumbnailRebuildStatus { Running = true, StartedAtUtc = DateTime.UtcNow };
            }

            _ = Task.Run(RunAsync);
            return true;
        }

        private async Task RunAsync()
        {
            try
            {
                List<(string ArmyCardType, long PdfFileId)> work;
                using (var scope = _scopeFactory.CreateScope())
                {
                    work = await scope.ServiceProvider.GetRequiredService<FileService>().GetAllPdfFilesForThumbnailsAsync();
                }

                lock (_lock) _status.Total = work.Count;
                _logger.LogInformation("Thumbnail rebuild started for {Count} PDFs", work.Count);

                foreach (var (armyCardType, pdfFileId) in work)
                {
                    lock (_lock) _status.Current = $"{armyCardType} PDF #{pdfFileId}";
                    try
                    {
                        using var scope = _scopeFactory.CreateScope();
                        await scope.ServiceProvider.GetRequiredService<FileService>().RegenerateThumbnailForPdfIdAsync(armyCardType, pdfFileId);
                        lock (_lock) _status.Succeeded++;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Thumbnail rebuild failed for {Type} PDF {Id}", armyCardType, pdfFileId);
                        lock (_lock)
                        {
                            _status.Failed++;
                            if (_status.Errors.Count < MaxReportedErrors)
                                _status.Errors.Add($"{armyCardType} PDF #{pdfFileId}: {ex.Message}");
                        }
                    }
                    finally
                    {
                        lock (_lock) _status.Processed++;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Thumbnail rebuild aborted");
                lock (_lock) _status.Errors.Add($"Aborted: {ex.Message}");
            }
            finally
            {
                lock (_lock)
                {
                    _status.Running = false;
                    _status.Current = null;
                    _status.FinishedAtUtc = DateTime.UtcNow;
                }
                _logger.LogInformation("Thumbnail rebuild finished: {Succeeded} ok, {Failed} failed", _status.Succeeded, _status.Failed);
            }
        }
    }
}
