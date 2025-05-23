﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class HoaDon
    {
        [Key]
        public int Id { get; set; }
        public string MaHoaDon { get; set; }
        public System.DateTime NgayTao { get; set; }
        public string GhiChu { get; set; } //ghi chu
        public int? TrangThai { get; set; }
        public string TenKhachHang { get; set; }
        public string SDT {  get; set; }
        public string GhiChuHoanHang { get; set; }
        public int? TypeHoaDon { get; set; }
        public int? IdParent { get; set; } // Id của hóa đơn cha (nếu có), dùng để phân biệt hóa đơn gốc và hóa đơn hoàn hàng
        public int? LoaiThanhToan { get; set; } // kiểu thanh toán
        public bool? IsPayed { get; set; } // đã thanh toán
        public decimal TongTien { get; set; }
        public string Tinh { get; set; }
        public string Huyen { get; set; }
        public string Xa { get; set; }
        public int? LoaiDon { get; set; } // offline hay online
        public string MaCuaHang { get; set; }  // VD: CH001, CH002
        public int? Id_CuaHang { get; set; }    // Khóa ngoại đến bảng CuaHang
        [ForeignKey("Id_CuaHang")]
        public virtual CuaHang CuaHang { get; set; }
        public string DiaChi { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        [NotMapped]
        public List<int> SpOrder { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? Id_User { get; set; }
        [ForeignKey("Id_User")]
        public virtual AppUser User { get; set; }
        public virtual ICollection<ChiTietHoaDon> ChiTietHoaDons { get; set; }
    }
}
