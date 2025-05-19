using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
namespace API.Dtos
{
    public class UploadPhieuNhapHang
    {
        public string NguoiLapPhieu { get; set; }
        public string GhiChu { get; set; }
        public decimal TongTien { get; set; }
        public string IdNhaCungCap { get; set; }
        public bool IsPayment { get; set; }
        public int LoaiPhieu { get; set; }
        public int IdKhoNhap {  get; set; }
        public int IdKhoXuat {  get; set; }
        public ICollection<UploadChiTietPhieuNhapHang> ChiTietPhieuNhaps { get; set; }
    }
}
