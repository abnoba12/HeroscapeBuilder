using System.Net;
using System.Net.Mail;

namespace HeroscapeBuilder.Server.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string htmlBody);
    }

    /// <summary>
    /// Sends mail over SMTP using the Email:* settings (Host, Port, User, Password, From, EnableSsl).
    /// With no Email:Host configured (local development) the message is logged instead of sent.
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendAsync(string to, string subject, string htmlBody)
        {
            var host = _configuration["Email:Host"];
            if (string.IsNullOrWhiteSpace(host))
            {
                _logger.LogWarning("Email:Host is not configured; not sending '{Subject}' to {To}. Body: {Body}", subject, to, htmlBody);
                return;
            }

            var from = _configuration["Email:From"] ?? _configuration["Email:User"];
            using var message = new MailMessage(from!, to, subject, htmlBody) { IsBodyHtml = true };
            using var client = new SmtpClient(host, int.TryParse(_configuration["Email:Port"], out var port) ? port : 587)
            {
                EnableSsl = !string.Equals(_configuration["Email:EnableSsl"], "false", StringComparison.OrdinalIgnoreCase)
            };
            var user = _configuration["Email:User"];
            if (!string.IsNullOrEmpty(user))
            {
                client.Credentials = new NetworkCredential(user, _configuration["Email:Password"]);
            }
            await client.SendMailAsync(message);
        }
    }
}
