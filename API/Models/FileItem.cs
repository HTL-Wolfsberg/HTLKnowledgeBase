namespace API.Models
{
    public class FileItem
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public List<FileTag> Tags { get; set; }
    }

    public class FileTag
    {
        public int Id
        {
            get; set;
        }
        public string Tag { get; set; }
        public int FileItemId { get; set; }
        public FileItem FileItem { get; set; }
    }

}
