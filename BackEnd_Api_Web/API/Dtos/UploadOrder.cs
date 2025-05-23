﻿using API.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace API.Dtos
{
    public class UploadOrder
    {
        public int Id { get; set; }
        public string MaHoaDon { get; set; }
        public System.DateTime NgayTao { get; set; }
        public string GhiChu { get; set; } //ghi chu
        public int? TrangThai { get; set; }
        public string TenKhachHang { get; set; }
        public string SDT {  get; set; }
        public int? LoaiThanhToan { get; set; } // kiểu thanh toán // 1 là thanh toán khi nhận hàng, 2 là thanh toán online
        public bool? IsPayed { get; set; } // đã thanh toán
        public decimal TongTien { get; set; }
        public string Tinh { get; set; }
        public string Huyen { get; set; }
        public string Xa { get; set; }
        public string DiaChi { get; set; }
        public int? LoaiDon { get; set; }
        public int? IdCuaHang { get; set; }
        public string MaCuaHang { get; set; }
        public List<int> SpOrder { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? Id_User { get; set; }
        [ForeignKey("Id_User")]
        public virtual AppUser User { get; set; }
        public virtual ICollection<ChiTietHoaDon> ChiTietHoaDons { get; set; }
    }
}
