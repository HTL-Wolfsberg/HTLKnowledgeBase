using System.ComponentModel.DataAnnotations;

namespace API.Document
{
    public class Document
    {
        [Key]
        public Guid Guid { get; set; }
        public string Path { get; set; }

        public ICollection<Tag> Tags { get; set; }

        public Document()
        {
            Tags = new List<Tag>();
        }
    }
}
