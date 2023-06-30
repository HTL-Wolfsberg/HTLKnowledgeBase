using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations;

namespace API.Document
{
    public class DocumentContext : DbContext
    {
        public DbSet<Document> Documents { get; set; }
        public DbSet<Tag> Tags { get; set; }

        public DocumentContext(DbContextOptions<DocumentContext> options)
                : base(options) { }
    }
}
