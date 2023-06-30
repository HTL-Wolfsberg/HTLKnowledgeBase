using System.ComponentModel.DataAnnotations;

namespace API.Document
{
    public class Tag
    {
        [Key]
        public Guid Guid { get; set; }
        public string Name { get; set; }
    }
}
