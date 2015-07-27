using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplicationAndAPI.Models;

namespace WebApplicationAndAPI.Controllers
{
    public class AppCacheController : Controller
    {
        public AppCacheController()
        {
        }

        public string Index(string id)
        {
            HttpCachePolicyBase cache = HttpContext.Response.Cache;
            TimeSpan cacheDuration = TimeSpan.FromSeconds(60);

            cache.SetCacheability(HttpCacheability.Public);
            cache.SetExpires(DateTime.Now.Add(cacheDuration));
            cache.SetMaxAge(cacheDuration);
            cache.AppendCacheExtension("must-revalidate, proxy-revalidate");
            Response.ContentType = "text/cache-manifest";
            var model = new AppCacheViewModel(Url, id);
            var appversion = ConfigurationManager.AppSettings[id];
            var version = "v=" + appversion + " a=" + typeof(AppCacheController).Assembly.GetName().Version.ToString();
            if (string.IsNullOrEmpty(appversion))
            {
                version = "a=" + typeof(AppCacheController).Assembly.GetName().Version.ToString();
            }

            model.PageComment = id + " cache version : " + version;
            
            return RenderRazorViewToString("Index", model);
        }

        //MVC is generating a blank line in first position, which makes appcache not working...
        //this is a small hack to avoid that blank line
        private string RenderRazorViewToString(string viewName, object model)
        {
            ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }

    }
}
