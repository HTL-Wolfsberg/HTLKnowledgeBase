using API.Document;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Microsoft.Identity.Web;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var postgresConnectionString = Configuration.GetValue<string>("ConnectionStrings:postgres");

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
            services.AddMicrosoftIdentityWebApiAuthentication(Configuration);
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

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
