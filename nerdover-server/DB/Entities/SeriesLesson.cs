using System;
using System.Collections.Generic;

namespace nerdover_server.DB.Entities;

public partial class SeriesLesson
{
    public string Id { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string CategoryId { get; set; } = null!;

    public string SeriesId { get; set; } = null!;
    
    public string? Cover { get; set; }

    public string? Content { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Series Series { get; set; } = null!;
}
