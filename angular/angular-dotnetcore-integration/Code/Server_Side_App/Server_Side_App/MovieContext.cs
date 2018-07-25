using Microsoft.EntityFrameworkCore;
using Server_Side_App.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server_Side_App
{
    public class MovieContext : DbContext
    {
        public MovieContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
    }
}
