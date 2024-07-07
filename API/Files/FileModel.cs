using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using API.Models;

namespace API.Files
{
    public class FileModel
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
        public string FileType { get; set; }

        public ICollection<string> TagNameList { get; set; } = [];

        [JsonIgnore]
        public ICollection<FileTagModel> FileTags { get; set; } = [];
    }


}
