namespace API.Dtos
{
    public class TonKhoDto
    {
        public int Id { get; set; }
        public int IdSanPham { get; set; }
        public int IdSanPhamBienThe { get; set; }
        public string TenSanPham { get; set; }
        public string TenKho { get; set; }
        public int SoLuongTon { get; set; }
        public int IdKho { get; set; }
        public int? IdNhaCungCap { get; set; }
        public int? SoLuongCanhBao { get; set; }
        public int SoLuongDaBan { get; set; }
    }

}
