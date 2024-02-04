namespace API
{
    public interface IFileService
    {
        Task<FileUploadSummary> UploadFileAsync(Stream fileStream, string contentType);
    }
}
