using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class ApiKeyAuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private const string ApiKeyHeaderName = "X-API-KEY";
    private static string _configuredApiKey;

    public static void Initialize(IConfiguration configuration)
    {
        _configuredApiKey = configuration["ApiKey"];
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!context.HttpContext.Request.Headers.TryGetValue(ApiKeyHeaderName, out var extractedApiKey) ||
            extractedApiKey != _configuredApiKey)
        {
            context.Result = new UnauthorizedResult();
        }
    }
}
