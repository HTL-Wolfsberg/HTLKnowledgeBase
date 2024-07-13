using Azure;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using API.Tags;
using API.Files;

namespace API.FileTags
{
    public class FileTagModel
    {
        public Guid FileId { get; set; }
        public FileModel File { get; set; }

        public Guid TagId { get; set; }
        public TagModel Tag { get; set; }

    }
}
