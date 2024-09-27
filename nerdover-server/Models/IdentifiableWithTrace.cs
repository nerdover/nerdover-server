namespace nerdover_server.Models
{
    public class IdentifiableWithTrace : Identifiable
    {
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
