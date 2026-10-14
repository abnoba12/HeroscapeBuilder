using System.Net;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;

namespace HeroscapeBuilder.Server.Program
{
    /// <summary>
    /// Request-level hardening: trusted client-IP resolution behind Cloudflare/nginx, rate limiting for the auth
    /// endpoints, and browser security headers.
    /// </summary>
    public static class SecurityHardening
    {
        public const string LoginLimiter = "auth-login";
        public const string RefreshLimiter = "auth-refresh";
        public const string RegisterLimiter = "auth-register";

        // Cloudflare's published proxy ranges (https://www.cloudflare.com/ips/).
        private static readonly string[] CloudflareNetworks =
        {
            "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22", "141.101.64.0/18",
            "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20", "197.234.240.0/22", "198.41.128.0/17",
            "162.158.0.0/15", "104.16.0.0/13", "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
            "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32", "2405:8100::/32",
            "2a06:98c0::/29", "2c0f:f248::/32"
        };

        // nginx reaches the app over the Docker bridge / LAN, so private ranges are trusted proxies too.
        private static readonly string[] PrivateNetworks =
        {
            "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "127.0.0.0/8", "::1/128", "fc00::/7"
        };

        public static WebApplicationBuilder AddSecurityHardening(this WebApplicationBuilder builder)
        {
            // Only honour X-Forwarded-For from our own proxy chain (nginx, Cloudflare). Walking the chain right to left
            // and stopping at the first address that isn't a known proxy means a client that reaches the origin directly
            // can't spoof its IP to dodge the rate limiter.
            builder.Services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor;
                options.ForwardLimit = null;
                options.KnownProxies.Clear();
                options.KnownIPNetworks.Clear();
                foreach (var cidr in CloudflareNetworks.Concat(PrivateNetworks))
                {
                    options.KnownIPNetworks.Add(System.Net.IPNetwork.Parse(cidr));
                }
            });

            builder.Services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
                options.OnRejected = async (context, token) =>
                {
                    if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    {
                        context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
                    }
                    await context.HttpContext.Response.WriteAsync("Too many attempts. Please wait a moment and try again.", token);
                };

                AddPerIpLimiter(options, LoginLimiter, permits: 10, window: TimeSpan.FromMinutes(1));
                AddPerIpLimiter(options, RefreshLimiter, permits: 60, window: TimeSpan.FromMinutes(1));
                AddPerIpLimiter(options, RegisterLimiter, permits: 5, window: TimeSpan.FromMinutes(10));
            });

            return builder;
        }

        private static void AddPerIpLimiter(RateLimiterOptions options, string policy, int permits, TimeSpan window)
        {
            options.AddPolicy(policy, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = permits,
                        Window = window,
                        QueueLimit = 0,
                        AutoReplenishment = true
                    }));
        }

        private const string DefaultContentSecurityPolicy =
            "default-src 'self'; " +
            "script-src 'self' https://www.googletagmanager.com https://cdnjs.buymeacoffee.com; " +
            "style-src 'self' 'unsafe-inline' https://cdnjs.buymeacoffee.com https://fonts.googleapis.com; " +
            "img-src 'self' data: blob: https://files.heroscapebuilder.com https://www.googletagmanager.com https://*.google-analytics.com https://*.buymeacoffee.com; " +
            "font-src 'self' data: https://fonts.gstatic.com; " +
            "connect-src 'self' https://files.heroscapebuilder.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; " +
            "frame-src 'self' https://files.heroscapebuilder.com https://www.buymeacoffee.com; " +
            "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'";

        /// <summary>
        /// Adds the standard browser security headers. The Content-Security-Policy runs in report-only mode unless
        /// <c>Security:CspMode</c> is set to "enforce" ("off" disables it), so a policy gap can't break the live site.
        /// </summary>
        public static WebApplication UseSecurityHeaders(this WebApplication app)
        {
            var cspMode = (app.Configuration["Security:CspMode"] ?? "report-only").ToLowerInvariant();
            var csp = app.Configuration["Security:ContentSecurityPolicy"] ?? DefaultContentSecurityPolicy;
            var sendHsts = !app.Environment.IsDevelopment();

            app.Use(async (context, next) =>
            {
                context.Response.OnStarting(() =>
                {
                    var headers = context.Response.Headers;
                    headers["X-Content-Type-Options"] = "nosniff";
                    headers["X-Frame-Options"] = "SAMEORIGIN";
                    headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
                    headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=(self)";
                    if (sendHsts)
                    {
                        // Browsers ignore this over plain HTTP, so it is safe to send behind a TLS-terminating proxy.
                        headers["Strict-Transport-Security"] = "max-age=31536000";
                    }
                    if (cspMode == "enforce") headers["Content-Security-Policy"] = csp;
                    else if (cspMode != "off") headers["Content-Security-Policy-Report-Only"] = csp;
                    return Task.CompletedTask;
                });
                await next();
            });

            return app;
        }
    }
}
