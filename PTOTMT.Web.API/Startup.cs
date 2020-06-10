using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using PTOTMT.Common.Entities;
using PTOTMT.Repository;
using PTOTMT.Repository.Abstraction.Web;
using PTOTMT.Repository.Implementation.Web;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
            services.AddAuthentication(opt => {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "http://localhost:5000",
                    ValidAudience = "http://localhost:5000",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@123"))
                };
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
            app.UseCors("CrossOrigin");
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>  { endpoints.MapControllers(); });
        }
    }
}
