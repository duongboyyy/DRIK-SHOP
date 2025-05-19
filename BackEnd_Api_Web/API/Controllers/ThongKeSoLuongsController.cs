using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Models;
using API.Helper.SignalR;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongKeSoLuongsController : ControllerBase //thong ke theo mot Object hoac 1 so
    {
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        private readonly DPContext _context;
        private readonly IDataConnector _connector;
        public ThongKeSoLuongsController(DPContext context, IHubContext<BroadcastHub, IHubClient> hubContext, IDataConnector connector)
        {
            this._context = context;
            this._hubContext = hubContext;
            this._connector = connector;
        }
        //Số lượng sản phẩm
        [HttpGet("countproduct")]
        public async Task<ActionResult<int>> GetProductCount()
        {
            int count = await (from not in _context.SanPhams.Where(s => s.IsActive == true)
                               select not).CountAsync();
            return count;
        }
        //Số lượng đơn hàng
        [HttpGet("countorder")]
        public async Task<ActionResult<int>> GetOrderCount()
        {
            int count = await (from not in _context.HoaDons.Where(s => s.TrangThai == 2)
                               select not).CountAsync();
            return count;
        }
        //Số lượng user
        [HttpGet("countuser")]
        public async Task<ActionResult<int>> GetUserCount()
        {
            int count = await (from not in _context.AppUsers
                               select not).CountAsync();
            return count;
        }
        //Số lượng tiền thu về
        [HttpGet("countmoney")]
        public async Task<ActionResult<decimal>> GetMoneyCount()
        {
            var tongThuTuDonBan = await _context.HoaDons
                .Where(hd => hd.TrangThai == 2 && hd.IsPayed == true)
                .SumAsync(hd => (decimal?)hd.TongTien) ?? 0;

            var donHoan = await _context.HoaDons
                .Where(hd => hd.TrangThai == 8 || hd.TrangThai == 10)
                .ToListAsync();

            decimal tongThuTuDonHoan = 0;

            foreach (var hd in donHoan)
            {
                decimal tongTienHoan = hd.TongTien;

                var tongTienDonCon = await _context.HoaDons
                    .Where(x => x.IdParent == hd.Id)
                    .SumAsync(x => (decimal?)x.TongTien) ?? 0;

                tongThuTuDonHoan += tongTienHoan - tongTienDonCon;
            }

            decimal tongDoanhSo = tongThuTuDonBan + tongThuTuDonHoan;
            return tongDoanhSo;
        }

        //Khách hàng mua nhiều nhất
        [HttpGet("getkhachhangmuanhieunhat")]
        public async Task<ActionResult<KhachHangMuaNhieuNhat>> GetKhachHangMuaNhieuNhat()
        {
            var khachHang = from h in _context.HoaDons.Where(x => x.TongTien == _context.HoaDons.Select(x => x.TongTien).Max())
                            join u in _context.Users
                            on h.Id_User equals u.Id
                            select new KhachHangMuaNhieuNhat()
                            {
                                Id_User = u.Id,
                                TongTienDaChiTieu = h.TongTien,
                            };
            return await khachHang.FirstOrDefaultAsync();
        }
        //Sản phẩm bán chạy nhất
        [HttpGet("getsanphambanchay")]
        public async Task<ActionResult<TenSanPham>> GetSanPhamBanChayNhatAsync()
        {
            var query = from s in _context.SanPhams
                        join c in _context.ChiTietHoaDons
                        on s.Id equals c.Id_SanPham
                        join b in _context.SanPhamBienThes
                        on s.Id equals b.Id_SanPham
                        join h in _context.HoaDons
                        on c.Id_HoaDon equals h.Id
                        select new TenSanPham()
                        {
                            TenSP = $"{s.Ten} {_context.Sizes.Find(b.Id).TenSize} {_context.MauSacs.Find(b.Id).MaMau}",
                            SoSanPhamBanDuoc = c.Soluong,
                        };
            var tenSP = await query.GroupBy(x => x.TenSP).Select(x => x.FirstOrDefault()).FirstOrDefaultAsync();
            return tenSP;
        }

        [HttpGet("nam2021")]
        public async Task<ActionResult<NamSoTongTien>> GetTongTienTheoNgay(DateTime fromDate, DateTime toDate)
        {
            var now = DateTime.Now;
            fromDate = new DateTime(now.Year, 1, 1);
            toDate = new DateTime(now.Year, 12, 31);
            return await _connector.GetTongTienTheoNgay(fromDate, toDate);
        }

        [HttpGet("soluongton")]
        public async Task<ActionResult<int>> GetSoLuongTonTrongKho()
        {
            var query = from s in _context.SanPhamBienThes
                        join sp in _context.SanPhams
                        on s.Id_SanPham equals sp.Id
                        select new SanPhamTonKho
                        {
                            Ten = sp.Ten,
                            SoLuongTon = s.SoLuongTon,
                        };
            var slt = await query.ToListAsync();

            return Ok(slt);
        }
        //Tong so luong ban ra trong nam
        [HttpGet("Soluongsanphambanratrongnam")]
        public async Task<ActionResult<SoLuongBanRaTrongNam>> GetSoLuongBanRaTrongNam()
        {
            int year = DateTime.Now.Year;
            try
            {
                var query = from h in _context.HoaDons.Where(x => x.NgayTao.Year == 2024)
                            join c in _context.ChiTietHoaDons
                            on h.Id equals c.Id_HoaDon
                            select new SoLuongBanRaTrongNam()
                            {
                                Nam = h.NgayTao.Year,
                                SoLuong = c.Soluong,
                            };
                var list = await query
                    .ToListAsync();
                var nam2021 = list.GroupBy(x => x.Nam)
                    .Select(x => x.FirstOrDefault())
                    .FirstOrDefault();
                return nam2021;
            }
            catch (Exception ex)
            {
                var bug = ex;
                return BadRequest();
            }
        }
    }
}
