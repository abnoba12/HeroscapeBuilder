namespace HeroscapeBuilder.Server.Services.Background
{
    /// <summary>
    /// Runs <see cref="ShopCheckoutService.Reconcile"/> shortly after startup and then every few minutes, so a missed
    /// webhook, a closed browser tab or a failed email never leaves a paid order unrecorded or unannounced.
    /// (Kept out of the HeroscapeBuilder.Server.Services namespace, which is auto-registered as scoped services.)
    /// </summary>
    public class ShopReconciliationWorker : BackgroundService
    {
        private static readonly TimeSpan StartupDelay = TimeSpan.FromSeconds(30);
        private static readonly TimeSpan Interval = TimeSpan.FromMinutes(5);

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ShopReconciliationWorker> _logger;

        public ShopReconciliationWorker(IServiceScopeFactory scopeFactory, ILogger<ShopReconciliationWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                await Task.Delay(StartupDelay, stoppingToken);

                using var timer = new PeriodicTimer(Interval);
                do
                {
                    try
                    {
                        using var scope = _scopeFactory.CreateScope();
                        await scope.ServiceProvider.GetRequiredService<ShopCheckoutService>().Reconcile(stoppingToken);
                    }
                    catch (Exception ex) when (ex is not OperationCanceledException)
                    {
                        // One bad run (database or Stripe unreachable) must not stop future runs.
                        _logger.LogError(ex, "Card shop reconciliation failed; it will run again in {Minutes} minutes.", Interval.TotalMinutes);
                    }
                }
                while (await timer.WaitForNextTickAsync(stoppingToken));
            }
            catch (OperationCanceledException)
            {
                // App shutting down.
            }
        }
    }
}
