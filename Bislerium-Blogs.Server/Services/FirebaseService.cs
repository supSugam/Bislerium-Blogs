using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.Helpers;
using Bislerium_Blogs.Server.Interfaces;
using Firebase.Auth;
using Firebase.Storage;
using Microsoft.Identity.Client.Extensions.Msal;

namespace Bislerium_Blogs.Server.Services
{
    public class FirebaseService:IFirebaseService
    {
        private readonly FirebaseStorage _firebaseStorage;

        public FirebaseService()
        {

            var auth = new FirebaseAuthProvider(new FirebaseConfig("AIzaSyBhncP-sleaWNBvIdL-FS624oxWw1xIn68"));
            var firebaseToken = auth.SignInWithEmailAndPasswordAsync(Constants.ADMIN_EMAIL, Constants.ADMIN_PASSWORD).Result.FirebaseToken;
            var options = new FirebaseStorageOptions
            {
                AuthTokenAsyncFactory = () => Task.FromResult(firebaseToken),
                ThrowOnCancel = true,
            };

            _firebaseStorage = new FirebaseStorage("bislerium-blogs.appspot.com", options);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string folderName, string fileName)
        {
 
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Seek(0, SeekOrigin.Begin);

            CancellationToken cancellationToken = new();
                string mimeType = $"image/{FileHelper.GetFileExtensionFromFileName(fileName)}";
                Console.WriteLine(mimeType);
                var imageUrl = await _firebaseStorage
                .Child(folderName)
                .Child(fileName)
                .PutAsync(stream, cancellationToken, mimeType);
            return imageUrl;
            }

        }

        public async Task DeleteFileAsync(string folderName, string fileName)
        {
            await _firebaseStorage
                .Child(folderName)
                .Child(fileName)
                .DeleteAsync();
        }


    }
}