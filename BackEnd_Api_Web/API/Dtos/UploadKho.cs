using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace API.Dtos
{
    public partial class UploadKho
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Tinh { get; set; }
        public string Huyen { get; set; }
        public string Xa { get; set; }
        public bool IsActive { get; set; }

    }
}
