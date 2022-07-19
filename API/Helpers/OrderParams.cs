namespace API.Helpers
{
    public class OrderParams : PaginationParams
    {
        public string OrderBy { get; set; } = "OrderDate";
        public int UserId { get; set; }
  

        
    }
}