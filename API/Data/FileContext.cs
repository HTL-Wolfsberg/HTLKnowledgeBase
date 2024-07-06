namespace API.Data
{
    using API.Models;
    using Microsoft.EntityFrameworkCore;

    public class FileContext : DbContext
    {
        public FileContext(DbContextOptions<FileContext> options) : base(options) { }

        public DbSet<FileModel> Files { get; set; }
    }

}
