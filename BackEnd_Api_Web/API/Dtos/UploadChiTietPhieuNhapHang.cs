using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
namespace API.Dtos
{
    public class UploadChiTietPhieuNhapHang
    {
        public decimal GiaNhapSanPhamBienThe { get; set; }
        public string TenSanPhamBienThe { get; set; }
        public int IdSanPhamBienThe { get; set; }
        public int SoLuongNhap { get; set; }
        public int IdKho { get; set; }
        public DateTime? NgaySanXuat { get; set; }
        public DateTime? NgayHetHan { get; set; }
    }
}
