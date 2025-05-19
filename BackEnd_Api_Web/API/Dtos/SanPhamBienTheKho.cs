using System;

namespace API.Dtos
{
    public class SanPhamBienTheKho
    {
        public int Id { get; set; }
        public string TenFull { get; set; }
        public string TenKho {  get; set; }
        public int SoLuong {  get; set; }
        public int KhoId {  get; set; }
        public int SanPhamBienTheId {  get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
