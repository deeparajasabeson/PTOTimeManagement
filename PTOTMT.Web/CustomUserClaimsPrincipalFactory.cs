using Microsoft.AspNetCore.Identity;
using PTOTMT.Web.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PTOTMT.Web
{
    public class CustomUserClaimsPrincipalFactory : IUserClaimsPrincipalFactory<ApplicationUser>
    {

        public async Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
        {
            var principal = await CreateAsync(user);
            ((ClaimsIdentity)principal.Identity).AddClaims(new[] {
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
            });
            return principal;
        }

        Task<ClaimsPrincipal> IUserClaimsPrincipalFactory<ApplicationUser>.CreateAsync(ApplicationUser user)
        {
            throw new System.NotImplementedException();
        }
    }
}