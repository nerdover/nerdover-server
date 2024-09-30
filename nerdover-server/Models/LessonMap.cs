namespace nerdover_server.Models;

public class LessonMap : IdentifiableWithTrace
{
    public IEnumerable<IdentifiableWithTrace>? Lessons { get; set; }
    public IEnumerable<SeriesMap>? Series { get; set; }
}