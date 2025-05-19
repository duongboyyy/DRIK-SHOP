using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class PhieuHoanHang
    {
        [Key]
        public int Id { get; set; }
        public string MaPhieuHoan { get; set; }
        public int Id_HoaDon { get; set; }
        [ForeignKey("Id_HoaDon")]
        public virtual HoaDon HoaDon { get; set; }
        public int? Id_CuaHang { get; set; }
        public DateTime NgayHoan { get; set; } // Ngày hoàn hàng
        public string LyDo { get; set; } // Lý do hoàn hàng
        public decimal TongTienHoan { get; set; } // Tổng số tiền hoàn
        public int TrangThai { get; set; } // 0: Chờ xử lý, 1: Đã xử lý, 2: Từ chối
        public string? Id_User { get; set; } // Người thực hiện hoàn hàng
        [ForeignKey("Id_User")]
        public virtual AppUser User { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string NoteTrangThai {  get; set; }
        public virtual ICollection<ChiTietPhieuHoanHang> ChiTietPhieuHoanHangs { get; set; }
    }
}
