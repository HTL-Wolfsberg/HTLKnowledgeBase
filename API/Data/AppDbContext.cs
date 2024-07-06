using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<FileItem> FileItems { get; set; }
        public DbSet<FileTag> FileTags { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FileItem>()
                .HasMany(f => f.Tags)
                .WithOne(t => t.FileItem)
                .HasForeignKey(t => t.FileItemId);
        }
    }

}
