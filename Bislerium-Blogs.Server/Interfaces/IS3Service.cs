namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IS3Service
    {
        Task<string> UploadFileToS3
            (
                                  IFormFile file,
                                                                              string folderName,
                                                                                                               string fileName
                              );

        Task<bool> DeleteFileFromS3
            (
                                                                              string folderName,
                                                                                                               string fileName
                                         );

    }
}
