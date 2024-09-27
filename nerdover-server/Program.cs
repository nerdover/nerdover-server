using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using nerdover_server.DB;
using nerdover_server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("MasterDB");
builder.Services.AddDbContext<MasterContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<MasterContext>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapIdentityApi<AppUser>();

app.UseAuthorization();

app.MapControllers();

app.Run();
