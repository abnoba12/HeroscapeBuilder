namespace HeroscapeBuilder.Server.Domain.Exceptions
{
    public enum BattlegroupErrorKind
    {
        Validation,
        NotFound,
        Conflict,
    }

    public class BattlegroupException : Exception
    {
        public BattlegroupErrorKind Kind { get; }

        public IReadOnlyList<string> Errors { get; }

        public BattlegroupException(BattlegroupErrorKind kind, params string[] errors)
            : base(string.Join(" ", errors))
        {
            Kind = kind;
            Errors = errors;
        }
    }
}
