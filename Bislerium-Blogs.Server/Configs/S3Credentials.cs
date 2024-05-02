using Amazon.Runtime;
using Amazon.S3;

namespace Bislerium_Blogs.Server.Configs
{
    public static class S3Credentials
    {
        public static AmazonS3Client GetAmazonS3Client()
        {
            var accessKeyId = "AKIAZQ3DQ2K2DAXBB44T";
            var secretAccessKey = "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";
            var awsCredentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
            var s3Client = new AmazonS3Client(awsCredentials, Amazon.RegionEndpoint.USEast1);
            return s3Client;
        }
    }
}