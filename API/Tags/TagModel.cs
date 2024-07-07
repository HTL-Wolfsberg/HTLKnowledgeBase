using API.Models;

namespace API.Tags
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.ComponentModel.DataAnnotations;
    using System.Text.Json.Serialization;

    public class TagModel
    {
        public int Id { get; set; }
        public string TagName { get; set; }

        [JsonIgnore]
        public ICollection<FileTagModel> FileTags { get; set; } = new List<FileTagModel>();

    }

}
