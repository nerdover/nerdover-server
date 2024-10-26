using System;
using System.Collections.Generic;

namespace nerdover_server.DB.Entities;

public partial class Lesson
{
    public string Id { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string CategoryId { get; set; } = null!;

    public string? Cover { get; set; }

    public string? Content { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;
}
