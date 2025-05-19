using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class Kho
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string DiaChi { get; set; }
        public string Tinh { get; set; }
        public string Huyen { get; set; }
        public string Xa { get; set; }
        public double? Lat { get; set; }
        public double? Lng { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? IdCuaHang { get; set; }
        [ForeignKey("IdCuaHang")]
        public virtual CuaHang CuaHang { get; set; }
        public virtual ICollection<SanPhamKho> SanPhamKho { get; set; }
        public virtual ICollection<ChiTietPhieuNhapHang> ChiTietPhieuNhaps { get; set; }
    }

}