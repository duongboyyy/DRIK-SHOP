using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class SanPhamKho
    {
        [Key]
        public int Id { get; set; }
        public string MaLo { get; set; }
        public int SoLuong { get; set; }
        public int SoLuongCanhBao { get; set; }
        public int? IdCTPNH { get; set; }
        [ForeignKey("IdCTPNH")]
        public virtual ChiTietPhieuNhapHang ChiTietPhieuNhapHang { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? NgaySanXuat { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int KhoId { get; set; }
        [ForeignKey("KhoId")]
        public virtual Kho Kho { get; set; }
        public int SanPhamBienTheId { get; set; }
        [ForeignKey("SanPhamBienTheId")]
        public virtual SanPhamBienThe SanPhamBienThe { get; set; }
    }
}
