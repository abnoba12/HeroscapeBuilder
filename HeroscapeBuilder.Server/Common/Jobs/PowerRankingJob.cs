using HeroscapeBuilder.Server.Services;

namespace HeroscapeBuilder.Server.Common.Jobs
{
    /// <summary>
    /// Recomputes the power ratings in the background whenever new votes or games have arrived, so the ranking
    /// settles within a minute instead of being recalculated on every single vote.
    /// </summary>
    public class PowerRankingJob : BackgroundService
    {
        private static readonly TimeSpan StartDelay = TimeSpan.FromSeconds(30);
        private static readonly TimeSpan Interval = TimeSpan.FromMinutes(1);

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<PowerRankingJob> _logger;

        public PowerRankingJob(IServiceScopeFactory scopeFactory, ILogger<PowerRankingJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                await Task.Delay(StartDelay, stoppingToken);

                while (!stoppingToken.IsCancellationRequested)
                {
                    await RunOnce();
                    await Task.Delay(Interval, stoppingToken);
                }
            }
            catch (OperationCanceledException)
            {
                // Shutting down.
            }
        }

        private async Task RunOnce()
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var service = scope.ServiceProvider.GetRequiredService<PowerRankingService>();
                if (await service.NeedsRecompute())
                {
                    await service.Recompute();
                }
            }
            catch (Exception ex)
            {
                // A failed pass is retried on the next tick; it must never take the host down.
                _logger.LogError(ex, "Power ranking recompute failed.");
            }
        }
    }
}
