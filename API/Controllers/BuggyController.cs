using API.Data;
using API.Entitites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;

        public BuggyController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")] 
        public ActionResult<string> GetSecret()
        {
            return "Secret String";
        }
        

        // 404 not found
        [HttpGet("not-found")] 
        public ActionResult<AppCustomer> GetNotFound()
        {
            var thing = _context.Customers.Find(-1);
            if (thing == null)
            {
                return NotFound();
            }

            return Ok(); 
        } 

        [HttpGet("product/not-found")] 
        public ActionResult<Products> ProductNotFound()
        {
            var thing = _context.Products.Find(-1);
            if (thing == null)
            {
                return NotFound();
            }

            return Ok(); 
        }


       
       

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest() {
            return BadRequest("Bad Request");
        }

    }
}