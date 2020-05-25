using PTOTMT.Common.Entities;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System;

namespace PTOTMT.Web.Data
{
    public class ApplicationDbContext : IdentityDbContext<AspNetUsers, AspNetRoles, Guid>
    //ApiAuthorizationDbContext<AspNetUsers>

    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        //public ApplicationDbContext(
           // DbContextOptions options,
            //IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
    }
}
