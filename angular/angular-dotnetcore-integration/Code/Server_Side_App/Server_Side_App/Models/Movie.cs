using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Server_Side_App.Models
{
    [Table("Movie")]
    public class Movie
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Genre { get; set; }
        public string Director { get; set; }
    }
}
