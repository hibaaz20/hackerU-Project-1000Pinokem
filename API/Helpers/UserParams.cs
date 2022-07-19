namespace API.Helpers
{
    public class UserParams : PaginationParams
    {
        
        public string OrderBy { get; set; } = "username";
        

    }
}