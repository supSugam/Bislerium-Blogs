namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IFirebaseService
    {
         Task<string> UploadFileAsync
            (
                       IFormFile file,
                                             string folderName,
                                  string fileName
                   );

        Task DeleteFileAsync
            (
                                                                   string folderName,
                                  string fileName
                              );


    }
}
