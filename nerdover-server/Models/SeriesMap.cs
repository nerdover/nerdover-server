namespace nerdover_server.Models;

public class SeriesMap : IdentifiableWithTrace
{
    public IEnumerable<IdentifiableWithTrace>? SeriesLessons { get; set; }
}
