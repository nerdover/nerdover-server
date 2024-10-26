using System;
using System.Collections.Generic;

namespace nerdover_server.DB.Entities;

public partial class Category
{
    public string Id { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Cover { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    public virtual ICollection<Series> Series { get; set; } = new List<Series>();

    public virtual ICollection<SeriesLesson> SeriesLessons { get; set; } = new List<SeriesLesson>();
}
