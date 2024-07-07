using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using API.FileTags;

namespace API.Files
{
    public class FileModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public long Size { get; set; }
        public string Type { get; set; }

        [NotMapped]
        public ICollection<string> TagNameList { get; set; } = new List<string>();

        [JsonIgnore]
        public ICollection<FileTagModel> FileTags { get; set; } = new List<FileTagModel>();
    }


}
