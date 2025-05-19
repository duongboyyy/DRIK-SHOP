using System;
using System.Security.Cryptography.Pkcs;

namespace API.Dtos.ModelStoreProcedures
{
    public class Report_DoanhSoCuaHang
    {
        public string TenCuaHang { get; set; }
        public string MaCuaHang { get; set; }
        public decimal DoanhSo { get; set; }
        public int SoDon { get; set; }
    }

    public class Report_DoanhSoTheoNhaCungCap
    {
        public int MaNhaCungCap { get; set; }
        public string TenNhaCungCap { get; set; }
        public int? SoDonHang { get; set; }
        public decimal? DoanhSo { get; set; }
    }

    public class sp_ThongKeDonVaHoanHang
    {
        public string StateMent { get; set; }
        public int Quantity { get; set; }
        public string Proportion { get; set; }
    }

    public class SanPhamDaBanTheoKhoDto
    {
        public string TenSanPham { get; set; }
        public string TenSize { get; set; }
        public string MaMau { get; set; }
        public string TenKho { get; set; }
        public int TongSoLuongBan { get; set; }
        public decimal TongTien { get; set; }
    }


}
