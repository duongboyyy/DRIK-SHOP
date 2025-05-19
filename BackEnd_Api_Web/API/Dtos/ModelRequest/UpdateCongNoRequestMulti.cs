using API.Models;
using System.Collections.Generic;

namespace API.Dtos.ModelRequest
{
    public class UpdateCongNoRequestMulti
    {
        public string UserId { get; set; }
        public List<int> DanhSachPhieu { get; set; }
    }
}
