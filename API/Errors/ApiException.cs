namespace API.Errors
{
    public class ApiException
    {
        private string v = default!;

        public int StatusCode { get; set; }

        public string Message { get; set; }  = default!;
        public string Details { get; set; }  = default!;

        public ApiException(int statuscode, string message, string details)
        {
            StatusCode = statuscode;
            Message = message;
            Details = details;
        }

        public ApiException(int statusCode, string v)
        {
            StatusCode = statusCode;
            this.v = v;
        }
    }
}