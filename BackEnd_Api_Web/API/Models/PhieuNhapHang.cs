﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class PhieuNhapHang
    {
        public int Id { get; set; }
        public string SoChungTu { get; set; }
        public DateTime NgayTao { get; set; }
        public decimal TongTien { get; set; }
        public string GhiChu { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public decimal CongNo { get; set; }
        public bool? IsPayment { get; set; }
        public string NguoiCapNhat { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? LoaiPhieu { get; set; } // loại phiếu nhập từ NCC hay nhập về các kho cửa hàng, hay phiếu xuất
        public string NguoiLapPhieu { get; set; }
        [ForeignKey("NguoiLapPhieu")]
        public virtual AppUser AppUser { get; set; }
        public int Id_NhaCungCap { get; set; }
        [ForeignKey("Id_NhaCungCap")]
        public virtual NhaCungCap NhaCungCap { get; set; }
        public virtual ICollection<ChiTietPhieuNhapHang> ChiTietPhieuNhaps { get; set; }
    }
}
