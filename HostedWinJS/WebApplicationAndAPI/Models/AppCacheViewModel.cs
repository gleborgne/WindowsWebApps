using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;

namespace WebApplicationAndAPI.Models
{
    public class AppCacheViewModel
    {
        public List<string> ApplicationFiles { get; set; }
        public List<string> CommonFiles { get; set; }

        public string PageComment { get; set; }
        public string AppName { get; set; }

        private UrlHelper _urlHelper;

        public AppCacheViewModel(UrlHelper urlHelper, string appname)
        {
            AppName = appname;
            _urlHelper = urlHelper;
            ApplicationFiles = new List<string>();
            CommonFiles = new List<string>();

            GetElements();
        }

        private bool isValidFile(string filename)
        {
            if (!filename.EndsWith(".map") && !filename.EndsWith(".md") && !filename.EndsWith(".txt") && !filename.EndsWith(".less"))
            {
                return true;
            }
            return false;
        }

        private void GetElements()
        {
            ListFiles("Applications/common", file =>
            {
                //if (Path.GetExtension(file).ToLower() != ".css" && Path.GetExtension(file).ToLower() != ".less" && !file.Contains(".chirp."))
                //{
                var webFile = _urlHelper.Content("~/Applications/common" + file).ToLower();
                if (isValidFile(webFile))
                {
                    this.CommonFiles.Add(webFile);
                }
                //}
            });
            ListFiles("Applications/" + AppName, file =>
            {
                //if (Path.GetExtension(file).ToLower() != ".css" && Path.GetExtension(file).ToLower() != ".less" && !file.Contains(".chirp."))
                //{
                var webFile = _urlHelper.Content("~/Applications/" + AppName + file).ToLower();
                if (isValidFile(webFile))
                {
                    this.ApplicationFiles.Add(webFile);
                }
                //}
            });
        }        

        private void ListFiles(string serverPath, Action<string> act)
        {
            var webPath = serverPath.Replace("/", "\\");
            var localServerPath = HostingEnvironment.MapPath("~/" + serverPath);
            ListFilesInDir(localServerPath, webPath, act);


        }

        private void ListFilesInDir(string dir, string webPath, Action<string> act)
        {
            var files = Directory.GetFiles(dir);
            foreach (var file in files)
            {
                var idx = file.IndexOf(webPath);
                var localpath = file.Substring(idx + webPath.Length).Replace("\\", "/");
                var fName = Path.GetFileName(file);
                if (!fName.StartsWith("_"))
                    act(localpath);

            }

            var directories = Directory.GetDirectories(dir);
            foreach (var directory in directories)
            {
                var dirName = Path.GetFileName(directory);
                if (!dirName.StartsWith("_"))
                    ListFilesInDir(directory, webPath, act);
            }
        }
    }
}