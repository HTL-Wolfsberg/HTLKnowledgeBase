namespace API.Files
{
    using API.FileTags;
    using API.Tags;
    using Microsoft.EntityFrameworkCore;

    public class FileContext : DbContext
    {
        public FileContext(DbContextOptions<FileContext> options) : base(options) { }

        public DbSet<FileModel> Files { get; set; }
        public DbSet<TagModel> Tags { get; set; }
        public DbSet<FileTagModel> FileTags { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FileTagModel>()
                .HasKey(ft => new { ft.FileId, ft.TagId });

            modelBuilder.Entity<FileTagModel>()
                .HasOne(ft => ft.File)
                .WithMany(f => f.FileTags)
                .HasForeignKey(ft => ft.FileId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FileTagModel>()
                .HasOne(ft => ft.Tag)
                .WithMany(t => t.FileTags)
                .HasForeignKey(ft => ft.TagId);
        }
    }
}
