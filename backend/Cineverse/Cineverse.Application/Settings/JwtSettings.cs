using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cineverse.Application.Settings
{
    public class JwtSettings
    {
        public string Secret { get; set; } = string.Empty;
        public int ExpiryDays { get; set; } = 7;
    }
}
