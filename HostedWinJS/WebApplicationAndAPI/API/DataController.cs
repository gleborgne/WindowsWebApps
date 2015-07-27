using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApplicationAndAPI.API
{
    [RoutePrefix("api/data")]
    public class DataController : ApiController
    {
        [HttpGet]
        [Route("list")]
        public IHttpActionResult GetList()
        {
            var items = new List<Item>();
            for (var i = 0; i < 50; i++)
            {
                items.Add(new Item { Name = "Item" + i });
            }
            return Ok(items);
        }
    }

    public class Item
    {
        public string Name { get; set; }
    }
}
