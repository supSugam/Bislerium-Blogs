namespace Bislerium_Blogs.Server.Helpers
{
    public static class FileHelper
    {
        public static string GetFileExtension(IFormFile file)
        {
            return Path.GetExtension(file.FileName);
        }

        public static string GetFileNameWithoutExtension(IFormFile file)
        {
            return Path.GetFileNameWithoutExtension(file.FileName);
        }

        public static string GetFileName(string fileName, string fileExtension)
        {
            return $"{fileName}{fileExtension}";
        }

        public static string GetFileMimeType(IFormFile file)
        {
            return file.ContentType;
        }

        public static (string, string) SplitStringFromLastDot(string inputString)
        {
            int lastDotIndex = inputString.LastIndexOf('.');

            if (lastDotIndex == -1)
            {
                return (inputString, null);
            }
            else
            {
                string firstPart = inputString.Substring(0, lastDotIndex);
                string secondPart = inputString.Substring(lastDotIndex + 1);
                return (firstPart, secondPart);
            }
        }

        public static string GetFileExtensionFromFileName(string fileName)
        {
            return SplitStringFromLastDot
                (fileName).Item2;
        }

    }
}
