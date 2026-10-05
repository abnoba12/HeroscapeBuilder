using HeroscapeBuilder.Server.Services;

namespace HeroscapeBuilder.Server.Program
{
    public static class SeoEndpoints
    {
        private static readonly string[] Kinds = { "units", "species", "generals", "sets" };

        /// <summary>
        /// Serves /sitemap.xml and server-renders the head + body text of the data-driven pages so crawlers
        /// and link previews (which don't run JavaScript) see real content. Must be mapped before the SPA fallback.
        /// </summary>
        public static WebApplication MapSeoEndpoints(this WebApplication app)
        {
            app.MapGet("/sitemap.xml", async (SeoPageService seo) =>
                Results.Content(await seo.BuildSitemap(), "application/xml"));

            foreach (var staticPage in SeoPageService.StaticPages)
            {
                var path = staticPage.Path;
                app.MapGet(path, (IWebHostEnvironment env) => RenderStaticPage(env, path));
            }

            app.MapGet("/power-ranking", (SeoPageService seo, IWebHostEnvironment env) => RenderPage(seo, env, "power-ranking", null));

            foreach (var kind in Kinds)
            {
                var currentKind = kind;
                // Units have no index page; /data/unit-data is the entry point.
                if (currentKind != "units")
                {
                    app.MapGet($"/{currentKind}", (SeoPageService seo, IWebHostEnvironment env) => RenderPage(seo, env, currentKind, null));
                }
                app.MapGet($"/{currentKind}/{{slug}}", (string slug, SeoPageService seo, IWebHostEnvironment env) => RenderPage(seo, env, currentKind, slug));
            }

            return app;
        }

        private static async Task<IResult> RenderStaticPage(IWebHostEnvironment env, string path)
        {
            var indexFile = env.WebRootFileProvider.GetFileInfo("index.html");
            if (!indexFile.Exists) return Results.NotFound();

            using var reader = new StreamReader(indexFile.CreateReadStream());
            var template = await reader.ReadToEndAsync();

            var page = SeoPageService.GetStaticPage(path);
            return page == null
                ? Results.Content(template, "text/html; charset=utf-8")
                : Results.Content(SeoPageService.RenderShell(template, page), "text/html; charset=utf-8");
        }

        private static async Task<IResult> RenderPage(SeoPageService seo, IWebHostEnvironment env, string kind, string? slug)
        {
            var indexFile = env.WebRootFileProvider.GetFileInfo("index.html");
            if (!indexFile.Exists) return Results.NotFound();

            using var reader = new StreamReader(indexFile.CreateReadStream());
            var template = await reader.ReadToEndAsync();

            var page = await seo.GetPage(kind, slug);
            if (page == null)
            {
                // Let the React app render its own "not found" state, but tell crawlers the page doesn't exist.
                return Results.Content(template, "text/html; charset=utf-8", statusCode: StatusCodes.Status404NotFound);
            }

            return Results.Content(SeoPageService.RenderShell(template, page), "text/html; charset=utf-8");
        }
    }
}
