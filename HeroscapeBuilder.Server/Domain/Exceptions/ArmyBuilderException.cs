namespace HeroscapeBuilder.Server.Domain.Exceptions
{
    public enum ArmyBuilderErrorKind
    {
        Validation,
        NotFound,
        Conflict,
    }

    public class ArmyBuilderException : Exception
    {
        public ArmyBuilderErrorKind Kind { get; }

        public IReadOnlyList<string> Errors { get; }

        public ArmyBuilderException(ArmyBuilderErrorKind kind, params string[] errors)
            : base(string.Join(" ", errors))
        {
            Kind = kind;
            Errors = errors;
        }
    }
}
