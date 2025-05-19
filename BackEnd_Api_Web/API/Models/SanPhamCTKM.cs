using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace API.Models
{
    public class SanPhamCTKM
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }
        public int SanPhamId { get; set; }
        public SanPham SanPham { get; set; }
        public int CTKMId { get; set; }
        public CTKMs CTKM { get; set; }
        public bool? Status { get; set; }
        public bool? IsDelete { get; set; }
        public bool? IsActive { get; set; }
        [Column(TypeName = "decimal(18,0)")]
        public decimal? GiaKhuyenMai { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
