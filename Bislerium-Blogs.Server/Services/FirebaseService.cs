using Bislerium_Blogs.Server.Configs;
using Bislerium_Blogs.Server.Interfaces;
using Firebase.Auth;
using Firebase.Storage;

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
            var newStream = new MemoryStream();
            await file.CopyToAsync(newStream);
            newStream.Position = 0;

            CancellationToken cancellationToken = new();
            string mimeType = file.ContentType;
            var imageUrl = await _firebaseStorage
                .Child(folderName)
                .Child(fileName)
                .PutAsync(newStream, cancellationToken, mimeType);
            return imageUrl;

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