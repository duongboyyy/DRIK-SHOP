using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace API.Dtos
{
    public class UploadSanPhamKho
    {
        public int Id { get; set; }
        public int SanPhamBienTheId { get; set; }
        public int KhoId { get; set; }
        public int SoLuong { get; set; }
    }
}
