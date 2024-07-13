namespace API.Tags
{
    using System.Collections.Generic;
    using System.Text.Json.Serialization;
    using API.FileTags;

    public class TagModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public ICollection<FileTagModel> FileTags { get; set; } = new List<FileTagModel>();

    }

}
