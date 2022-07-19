namespace API.Helpers
{
    public class ProductParams : PaginationParams
    {

	    public int MinPrice { get; set; } = 0;
		public int MaxPrice { get; set; } = 5000;
        public string OrderBy { get; set; } = "created";


    }
}