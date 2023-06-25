using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;

namespace API
{
    public class Program
    {
        const string AllowSpecifiyOrigins = "AllowSpecifiyOrigins";

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Logging.ClearProviders();
            builder.Logging.AddDebug();
            builder.Logging.AddConsole();

            var postgresConnectionString = builder.Configuration.GetValue<string>("ConnectionStrings:postgres");
            Trace.WriteLine(postgresConnectionString);
            ConfigureServices(builder.Services, postgresConnectionString);

            //    builder.Services.AddCors((options) =>
            //    {
            //        options.AddDefaultPolicy(policy =>
            //        {
            //            policy.AllowAnyMethod()
            //.AllowAnyHeader()
            //.SetIsOriginAllowed(origin => true) // allow any origin
            //.AllowCredentials();
            //            //policy.WithOrigins("https://localhost:4200").AllowAnyMethod().AllowAnyHeader();
            //        });
            //    });

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }



            //app.UseAuthorization();

            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials());

            app.MapControllers();
            app.UseHttpsRedirection();
            app.Run();
        }

        public static void ConfigureServices(IServiceCollection services, string postgresConnectionString)
        {
            services.AddDbContext<DocumentContext>(options =>
                options.UseNpgsql(postgresConnectionString));
        }
    }
}