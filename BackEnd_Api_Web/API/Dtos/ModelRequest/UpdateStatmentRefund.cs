using System.Collections.Generic;

namespace API.Dtos.ModelRequest
{
    public class UpdateStatmentRefund
    {
        public int Id_HoaDon { get; set; }
        public int Id_TrangThai { get; set; }
        public List<int> ListSanPhamBienThe {  get; set; }
    }

}
