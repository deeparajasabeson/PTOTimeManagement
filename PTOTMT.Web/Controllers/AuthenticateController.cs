using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using PTOTMT.Common.Models;
using PTOTMT.Repository;
using System.Threading.Tasks;

namespace PTOTMT.Web.Controllers
{
    public class AuthenticateController : ControllerBase
    {
        private readonly IUnitOfWorkWebAPI uow;

        public AuthenticateController(IUnitOfWorkWebAPI _uow)
        {
            uow = _uow;
        }
        [HttpPost]
        public async Task<IActionResult> Login([FromBody]LoginRequest request)
        {
                return new JsonResult(new { RedirectUrl = request.ReturnUrl, IsOk = true });
         }
            //return Unauthorized();
    }
}