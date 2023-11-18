using API.Document;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;
using System.Text.Json.Serialization;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //Otherwise it launches the program on "Add-Migration" or "Update-Database"
            if (EF.IsDesignTime)
            {
                new HostBuilder().Build().Run();
                return;
            }

            WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()          
            .Build().Run();      
        }

        //Otherwise it launches the program on "Add-Migration" or "Update-Database"
        public static IHostBuilder CreateHostBuilder(string[] args)
        => Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(
                webBuilder => webBuilder.UseStartup<Startup>());

    }
}