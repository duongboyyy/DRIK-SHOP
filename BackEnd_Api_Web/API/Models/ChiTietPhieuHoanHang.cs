using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class ChiTietPhieuHoanHang
    {
        [Key]
        public int Id { get; set; }

        public int Id_PhieuHoanHang { get; set; }
        [ForeignKey("Id_PhieuHoanHang")]
        public virtual PhieuHoanHang PhieuHoanHang { get; set; }

        public int Id_ChiTietHoaDon { get; set; } // Tham chiếu đến ChiTietHoaDon
        [ForeignKey("Id_ChiTietHoaDon")]
        public virtual ChiTietHoaDon ChiTietHoaDon { get; set; }
        public int? Id_SanPhamBienThe { get; set; }
        public int? Id_Kho { get; set; }
        public string MaLo { get; set; }
        public int SoLuongHoan { get; set; } // Số lượng sản phẩm hoàn
        public decimal DonGiaHoan { get; set; } // Giá tiền hoàn lại
        public bool? DuocHoan { get; set; }// sản phẩm này được hoàn kho
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int SanPhamBienTheId { get; internal set; }
    }

}
