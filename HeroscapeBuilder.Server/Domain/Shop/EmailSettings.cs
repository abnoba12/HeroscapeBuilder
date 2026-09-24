namespace HeroscapeBuilder.Server.Domain.Shop
{
    /// <summary>
    /// SMTP settings for shop emails. Host and port come from the "Email" section of appsettings.json; the
    /// account and addresses come only from the HeroscapeBuilder environment config (EmailUsername, EmailPassword,
    /// ShopNotifyEmail and optionally EmailFrom).
    /// </summary>
    public class EmailSettings
    {
        public string? Host { get; init; }

        public int Port { get; init; } = 587;

        public string? Username { get; init; }

        public string? Password { get; init; }

        /// <summary>
        /// Sender address. Defaults to the username (what Gmail requires).
        /// </summary>
        public string? From { get; init; }

        /// <summary>
        /// Where "new order" and payment problem alerts are sent (the shop owner).
        /// </summary>
        public string? NotifyTo { get; init; }

        /// <summary>
        /// The SMTP account is set, so mail can go out (e.g. account verification emails to users).
        /// </summary>
        public bool CanSend => IsSet(Host) && IsSet(Username) && IsSet(Password);

        /// <summary>
        /// Mail can go out and there is an owner address for shop alerts.
        /// </summary>
        public bool IsConfigured => CanSend && IsSet(NotifyTo);

        public string? SenderAddress => IsSet(From) ? From : Username;

        /// <summary>
        /// A value still holding its %Placeholder% means the environment config did not supply it.
        /// </summary>
        public static bool IsSet(string? value) => !string.IsNullOrWhiteSpace(value) && !value.StartsWith('%');
    }
}
