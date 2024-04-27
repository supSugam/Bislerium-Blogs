namespace Bislerium_Blogs.Server.Interfaces
{
    public interface IApiResponse
    {
        public string path { get; set; }
        public bool success { get; set; }
        public int statusCode { get; set; }

    }

    public interface IFailedResponse : IApiResponse
    {
        public string[] message { get; set; }
    }

    public interface ISuccessResponse<T> : IApiResponse
    {
        public T data { get; set; }
    }

    public class FailedResponse : IFailedResponse
    {
        public string path { get; set; }
        public bool success { get; set; }
        public int statusCode { get; set; }
        public string[] message { get; set; }
    }

    public class SuccessResponse<T> : ISuccessResponse<T>
    {
        public string path { get; set; }
        public bool success { get; set; }
        public int statusCode { get; set; }
        public T data { get; set; }
    }
}
