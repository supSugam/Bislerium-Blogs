namespace Bislerium_Blogs.Server.Payload
{
    public class VotePayload
    {
        public int Popularity { get; set; }
        public bool IsVotedUp { get; set; }
        public bool IsVotedDown { get; set; }
        public int TotalComments { get; set; }

    }

    public class CommentReactionsPayload
    {
        public int Popularity { get; set; } = 0;
        public bool IsVotedUp { get; set; }=false;
        public bool IsVotedDown { get; set; }=false;
        public int TotalReplies { get; set; }=0;
    }
}
