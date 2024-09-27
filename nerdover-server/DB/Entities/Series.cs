using System;
using System.Collections.Generic;

namespace nerdover_server.DB.Entities;

public partial class Series
{
    public string Id { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string CategoryId { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<SeriesLesson> SeriesLessons { get; set; } = new List<SeriesLesson>();
}
