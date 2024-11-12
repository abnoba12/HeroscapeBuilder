public static class UrlHelper
{
    public static string Combine(params string[] urlSegments)
    {
        if (urlSegments == null || urlSegments.Length == 0)
        {
            throw new ArgumentException("No URL segments provided.");
        }

        return string.Join("/", urlSegments
            .Select(s => s.Trim('/')) // Remove leading/trailing slashes from each segment
            .Where(s => !string.IsNullOrEmpty(s))); // Remove any empty segments
    }
}
