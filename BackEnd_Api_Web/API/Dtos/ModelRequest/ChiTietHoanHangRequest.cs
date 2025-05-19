namespace API.Dtos.ModelRequest
{
    public class ChiTietHoanHangRequest
    {
        public int Id_ChiTietHoaDon { get; set; }
        public int SoLuongHoan { get; set; }
        //ublic int Id_SanPhamBienThe { get; set; }
        public int Id_Kho { get; set; }
        public string MaLo { get; set; }
        public bool IsBack { get; set; }
    }
}
