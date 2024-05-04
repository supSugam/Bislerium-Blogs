namespace Bislerium_Blogs.Server.Payload
{
    public class VotePayload
    {
        public int Popularity { get; set; }
        public bool IsVotedUp { get; set; }
        public bool IsVotedDown { get; set; }
        public int TotalComments { get; set; }

    }
}
