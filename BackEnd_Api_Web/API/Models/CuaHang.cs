using System.Collections.Generic;

namespace API.Models
{
    public class CuaHang
    {
        public int Id { get; set; }
        public string MaCuaHang { get; set; }
        public string TenCuaHang { get; set; }
        public string DiaChi { get; set; }
        public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();
        public virtual ICollection<Kho> Kho { get; set; }
    }
}
