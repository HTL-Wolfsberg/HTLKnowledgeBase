using API.Document;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Microsoft.Identity.Web;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace API
{
    //https://learn.microsoft.com/de-de/aspnet/core/security/authentication/azure-ad-b2c?view=aspnetcore-8.0
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var postgresConnectionString = Configuration.GetConnectionString("postgres");

            services.AddDbContext<DocumentContext>(options =>
               options.UseNpgsql(postgresConnectionString));

            services.AddControllers();
            services.AddMvc()
                .AddJsonOptions(
                    options => options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
                );

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
            });
            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = 100 * 1000 * 1000;
            });
            services.AddMicrosoftIdentityWebApiAuthentication(Configuration, "AzureAd")
                .EnableTokenAcquisitionToCallDownstreamApi()
                .AddInMemoryTokenCaches()
                ;

            services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, ApplicationUserClaimsPrincipalFactory>();

            //https://joonasw.net/view/adding-custom-claims-aspnet-core-2
            //services.AddAuthentication().AddMicrosoftAccount(options =>
            //{
            //    options.Events.OnCreatingTicket = async ctx =>
            //    {
            //        var claims = new List<Claim>
            //        {
            //            new Claim(ClaimTypes.Role, "superadmin")
            //        };
            //        var appIdentity = new ClaimsIdentity(claims);

            //        ctx.Principal?.AddIdentity(appIdentity);
            //    };
            //});


            //    services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
            //    {
            //        options.Events = new OpenIdConnectEvents
            //        {
            //            OnTokenValidated = ctx =>
            //            {


            //                // add claims
            //                var claims = new List<Claim>
            //{
            //        new Claim(ClaimTypes.Role, "Admin")
            //};
            //                var appIdentity = new ClaimsIdentity(claims);

            //                ctx.Principal.AddIdentity(appIdentity);

            //                return Task.CompletedTask;
            //            },
            //        };
            //    });

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader().WithExposedHeaders("filename")
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials());

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            //app.Use(async (context, next) =>
            //{
            //    if (!context.User.Identity?.IsAuthenticated ?? false)
            //    {
            //        context.Response.StatusCode = 401;
            //        await context.Response.WriteAsync("Not Authenticated");
            //    }
            //    else await next();

            //});

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}


//public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DocumentContext>
//{
//    public DocumentContext CreateDbContext(string[] args)
//    {
//        IConfigurationRoot configuration = new ConfigurationBuilder()
//            .SetBasePath(Directory.GetCurrentDirectory())
//            .AddJsonFile("appsettings.json")
//            .Build();
//        var builder = new DbContextOptionsBuilder<DocumentContext>();
//        var connectionString = configuration.GetConnectionString("postgres");
//        builder.UseNpgsql(connectionString);
//        return new DocumentContext(builder.Options);
//    }
//}