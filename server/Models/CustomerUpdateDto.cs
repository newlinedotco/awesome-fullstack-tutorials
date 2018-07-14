using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models
{
    public class CustomerUpdateDto
    {
        [Required]
        public string Name { get; set; }
        public string Position { get; set; }
        public int Age { get; set; }
    }
}
