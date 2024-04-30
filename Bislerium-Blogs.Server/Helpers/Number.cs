namespace Bislerium_Blogs.Server.Helpers
{
    public static class Number
    {

        public static int[] GenerateRandomNumbers(int length = 6)
        {
            var random = new Random();
            var otp = new int[length];
            for (int i = 0; i < length; i++)
            {
                otp[i] = random.Next(0, 10); // Change the upper bound to 10 to include 9
            }
            return otp;
        }

    }
}
