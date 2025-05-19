using System.Collections.Generic;

namespace API.Dtos.ModelRequest
{
    public class PhieuHoanHangRequest
    {
        public int Id_HoaDon { get; set; }
        public string Id_User { get; set; }
        public string LyDo { get; set; }
        public int Id_CuaHang { get; set; }
        public List<ChiTietHoanHangRequest> ChiTietHoanHangs { get; set; }
    }

}
