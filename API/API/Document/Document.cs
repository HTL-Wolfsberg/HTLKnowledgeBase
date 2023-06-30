using System.ComponentModel.DataAnnotations;

namespace API.Document
{
    public class Document
    {
        [Key]
        public Guid Guid { get; set; }
        public string Path { get; set; }
        public Tag[] Tags { get; set; }
    }
}
