using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Shop;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Sends plain text email through the SMTP account in <see cref="EmailSettings"/>.
    /// </summary>
    public class EmailSender
    {
        private readonly EmailSettings _email;

        public EmailSender(EmailSettings email)
        {
            _email = email;
        }

        public bool CanSend => _email.CanSend;

        public async Task Send(string to, string fromName, string subject, string body)
        {
            if (!_email.CanSend)
            {
                throw new ShopException(ShopErrorKind.Unavailable, "Email is not configured.");
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, _email.SenderAddress));
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;
            message.Body = new TextPart("plain") { Text = body };

            using var client = new SmtpClient { Timeout = 30000 };
            await client.ConnectAsync(_email.Host, _email.Port, _email.Port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_email.Username, _email.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
