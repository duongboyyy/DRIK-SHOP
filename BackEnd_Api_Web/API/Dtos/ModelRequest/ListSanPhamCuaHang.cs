using API.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace API.Dtos.ModelRequest
{
    public class ListSanPhamCuaHang
    {
        public int Id_SanPham { get; set; }
        public int? Id_SanPhamBienThe { get; set; }

        public string TenSanPham { get; set; }
        public decimal? Gia { get; set; }
        public string Mau { get; set; }
        public string Size { get; set; }
        public int SoLuong { get; set; }
    }
}
