namespace HeroscapeBuilder.Server.Domain.Exceptions
{
    public enum ShopErrorKind
    {
        Validation,
        NotFound,
        Conflict,
        /// <summary>Payments are not configured, or Stripe could not be reached.</summary>
        Unavailable,
    }

    public class ShopException : Exception
    {
        public ShopErrorKind Kind { get; }

        public IReadOnlyList<string> Errors { get; }

        public ShopException(ShopErrorKind kind, params string[] errors)
            : base(string.Join(" ", errors))
        {
            Kind = kind;
            Errors = errors;
        }
    }
}
