
namespace API.Helpers
{
    public class PaginationParams
    {
        private const int MaxPageSize = 50;

        public int PageNumber { get; set; }

        private int _pageSize = 12;
        public int PageSize
        {
            get => _pageSize; 
            set => _pageSize = Math.Min(MaxPageSize, value); 
        }
    }
}