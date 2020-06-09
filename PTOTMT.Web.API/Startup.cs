using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;
using Microsoft.Net.Http.Headers;
using PTOTMT.Repository.Abstraction.Web;
using PTOTMT.Repository.Implementation.Web;

namespace PTOTMT.Service
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CrossOrigin", policy =>
                {
                    policy.AllowAnyHeader()
                             .AllowAnyMethod()
                             .AllowAnyOrigin()
                             .WithExposedHeaders("x-custom-header");
                });
            });
            services.AddDbContext<PTOTMTWebAPIContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("PTOTMTWebAPIContext"));
            });
            services.AddTransient<IUnitOfWorkWebAPI, UnitOfWorkWebAPI>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                                           .AddControllersAsServices();

            var emailConfig = Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>();
            services.AddSingleton<EmailConfiguration>(emailConfig);
           // services.AddSingleton<EmailConfiguration>();
            services.AddSingleton<IEmailSender, EmailSender>();
            services.AddControllers();
        }
        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())  {  app.UseDeveloperExceptionPage(); }
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors(options => options.AllowAnyOrigin());
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>  { endpoints.MapControllers(); });
        }
    }
}
