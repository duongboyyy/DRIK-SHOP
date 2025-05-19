using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace API.Dtos
{
    public class TransferSanPhamKho
    {
        public int IdSanPhamKhoNguon { get; set; } // Id của bản ghi SanPhamKho ở kho nguồn
        public int KhoIdDich { get; set; } // Id của kho đích
        public int SoLuongChuyen { get; set; } // Số lượng cần chuyển
    }
}
