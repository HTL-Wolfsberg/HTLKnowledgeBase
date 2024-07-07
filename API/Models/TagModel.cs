namespace API.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.ComponentModel.DataAnnotations;

    public class TagModel
    {
        public int Id { get; set; }
        public string TagName { get; set; }

        public ICollection<FileTagModel> FileTags { get; set; } = new List<FileTagModel>();

    }

}
