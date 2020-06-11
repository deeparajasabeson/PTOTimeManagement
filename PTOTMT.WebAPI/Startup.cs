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
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Logging;

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
            IdentityModelEventSource.ShowPII = true;
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
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.Authority = Configuration["Jwt:Issuer"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                };
            });
            services.AddAuthorization(options =>
            {
                options.DefaultPolicy =
                     new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build();
            });
            services.AddTransient<IUnitOfWorkWebAPI, UnitOfWorkWebAPI>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
                                         .AddControllersAsServices();

            var emailConfig = Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>();
            services.AddSingleton(emailConfig);
            services.AddSingleton<IEmailSender, EmailSender>();
            services.AddScoped<IQuotaService, QuotaService>();
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) { app.UseDeveloperExceptionPage(); }
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("CrossOrigin");
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}
