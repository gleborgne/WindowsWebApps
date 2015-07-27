using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplicationAndAPI.Controllers
{
    public class AppController : Controller
    {
        // GET: App
        public ActionResult Index(string id)
        {
            ViewBag.AppName = id;
            return View(id);
        }
    }
}