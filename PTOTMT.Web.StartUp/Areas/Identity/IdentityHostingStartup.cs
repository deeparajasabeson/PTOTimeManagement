using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PTOTMT.Web.StartUp.Data;
using PTOTMT.Web.StartUp.Models;

[assembly: HostingStartup(typeof(PTOTMT.Web.StartUp.Areas.Identity.IdentityHostingStartup))]
namespace PTOTMT.Web.StartUp.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
            });
        }
    }
}