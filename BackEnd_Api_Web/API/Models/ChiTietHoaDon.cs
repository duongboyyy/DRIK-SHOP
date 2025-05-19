      using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class ChiTietHoaDon
    {
        [Key]
        public int Id { get; set; }
        public int Soluong { get; set; }     
        public decimal? ThanhTien { get; set; }
        public decimal? GiaBan { get; set; }
        public string Mau { get; set; }
        public string Size { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public string MaLo { get; set; }
        public int Id_Kho { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsRefund { get; set; }
        public bool? IsRefundAll { get; set; }
        public int? SoLuongDaHoan { get; set; } = 0; // Số lượng đã hoàn
        public int? SoLuongConLai; // Số lượng còn lại (không cần lưu DB, chỉ để tính toán)
        public int? Id_SanPham { get; set; }
        [ForeignKey("Id_SanPham")]
        public virtual SanPham SanPham { get; set; }
        public int? Id_SanPhamBienThe { get; set; }
        [ForeignKey("Id_SanPhamBienThe")]
        public virtual SanPhamBienThe SanPhamBienThe { get; set; }
        public int? Id_HoaDon { get; set; }
        [ForeignKey("Id_HoaDon")]
        public virtual HoaDon HoaDon { get; set; }
        public bool? IsBack { get; set; }
    }
}
