using Amazon.S3;
using Amazon.S3.Transfer;
using Bislerium_Blogs.Server.Interfaces;
using Bislerium_Blogs.Server.Configs;

namespace Bislerium_Blogs.Server.Services
{

        public class S3Service:IS3Service
        {
            private readonly AmazonS3Client _s3Client;
            private readonly string _bucketName = "bislerium-blogs";

            public S3Service()
            {
                _s3Client = S3Credentials.GetAmazonS3Client();
            }

            public async Task<string> UploadFileToS3(IFormFile file, string directory, string fileName)
            {
                try
                {
                    try
                    {
                        await DeleteFileFromS3(directory, fileName);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                        Console.WriteLine("Maybe the file does not exist yet. Continuing...");
                    }
                        var fileTransferUtility = new TransferUtility(_s3Client);
                    using var fileStream = file.OpenReadStream();
                var fileTransferUtilityRequest = new TransferUtilityUploadRequest
                    {
                        InputStream = fileStream,
                        Key = $"{directory}/{fileName}",
                        BucketName = _bucketName,
                        CannedACL = S3CannedACL.PublicRead
                    };

                    await fileTransferUtility.UploadAsync(fileTransferUtilityRequest);
                    return $"https://{_bucketName}.s3.amazonaws.com/{directory}/{fileName}";
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }   

            public async Task<bool>
                DeleteFileFromS3(string directory, string fileName)
            {
                try
                {
                    var fileTransferUtility = new TransferUtility(_s3Client);
                    await fileTransferUtility.S3Client.DeleteObjectAsync(_bucketName, $"{directory}/{fileName}");
                    return true;
                }
                catch (Exception ex)
                {
                Console.WriteLine(ex.Message);
                    throw new Exception("An error occurred while deleting the file from S3", ex);
                }
            }

        }
        }
