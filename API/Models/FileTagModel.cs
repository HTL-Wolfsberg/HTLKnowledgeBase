using Azure;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using API.Tags;
using API.Files;

namespace API.Models
{
    public class FileTagModel
    {
        public int FileId { get; set; }
        public FileModel File { get; set; }

        public int TagId { get; set; }
        public TagModel Tag { get; set; }

    }
}
