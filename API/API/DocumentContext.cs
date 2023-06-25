using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations;

namespace API
{
    public class DocumentContext : DbContext
    {
        public DbSet<Document> Documents { get; set; }


        public DocumentContext(DbContextOptions<DocumentContext> options)
                : base(options) { }
    }

    public class Document
    {
        [Key]
        public Guid Guid { get; set; }
        public string Path { get; set; }
    }
}
