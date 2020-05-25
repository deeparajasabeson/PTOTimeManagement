using System;
using System.Collections.Generic;
using System.Text;

namespace PTOTMT.Common.Models
{
    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ReturnUrl { get; set; }

    }
}
