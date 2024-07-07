namespace API.Files
{
    using API.Models;
    using API.Tags;
    using Azure;
    using Microsoft.EntityFrameworkCore;

    public class FileContext : DbContext
    {
        public FileContext(DbContextOptions<FileContext> options) : base(options) { }

        public DbSet<FileModel> Files { get; set; }
        public DbSet<TagModel> Tags { get; set; }
        public DbSet<FileTagModel> FileTags { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FileTagModel>()
                .HasKey(ft => new { ft.FileId, ft.TagId });

            modelBuilder.Entity<FileTagModel>()
                .HasOne(ft => ft.File)
                .WithMany(f => f.FileTags)
                .HasForeignKey(ft => ft.FileId);

            modelBuilder.Entity<FileTagModel>()
                .HasOne(ft => ft.Tag)
                .WithMany(t => t.FileTags)
                .HasForeignKey(ft => ft.TagId);
        }
    }
}
