using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Models;
using API.Helper.SignalR;
using API.Helper.Result;
using API.Dtos.ModelOveride;
using Org.BouncyCastle.Crypto;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using API.Dtos.ModelStoreProcedures;
using System.Globalization;
using API.Helpers;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongKeBieuDosController : ControllerBase //thong ke theo List<Object>
    {
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        private readonly DPContext _context;
        private readonly IDataConnector _connector;
        public ThongKeBieuDosController(DPContext context, IHubContext<BroadcastHub, IHubClient> hubContext, IDataConnector connector)
        {
            this._context = context;
            this._hubContext = hubContext;
            this._connector = connector;
        }
        /// <summary>
        /// Biểu đồ liên quan đến vấn đề bán hàng của shop
        /// </summary>
        /// <returns></returns>

        [HttpGet("topthongkethang")]
        public async Task<ActionResult<IEnumerable<ThangRevenue>>> GetDoanhSoThangAsync(int? year)
        {
            int selectedYear = year ?? DateTime.Now.Year;

            var donBans = await _context.HoaDons
                .Where(hd => hd.NgayTao.Year == selectedYear && hd.TrangThai == 2 && hd.IsPayed == true)
                .ToListAsync();

            var donHoans = await _context.HoaDons
                .Where(hd => hd.NgayTao.Year == selectedYear && (hd.TrangThai == 8 || hd.TrangThai == 10))
                .ToListAsync();

            var parentIds = donHoans.Select(x => x.Id).ToList();

            var donHoanCons = await _context.HoaDons
                .Where(x => x.IdParent != null && parentIds.Contains((int)x.IdParent))
                .ToListAsync();

            var result = donBans
                .GroupBy(hd => hd.NgayTao.Month)
                .Select(g => new ThangRevenue
                {
                    Month = g.Key.ToString(),
                    Revenues = g.Sum(hd => hd.TongTien)
                })
                .ToList();

            foreach (var donHoan in donHoans)
            {
                var thang = donHoan.NgayTao.Month.ToString();
                decimal tongCon = donHoanCons
                    .Where(x => x.IdParent == donHoan.Id)
                    .Sum(x => x.TongTien);

                var revenue = result.FirstOrDefault(x => x.Month == thang);
                if (revenue != null)
                    revenue.Revenues += (donHoan.TongTien - tongCon);
                else
                    result.Add(new ThangRevenue
                    {
                        Month = thang,
                        Revenues = donHoan.TongTien - tongCon
                    });
            }

            return result.OrderBy(x => x.Revenues).ToList();
        }



        [HttpPost("topthongkengaytheothang")]
        public async Task<ActionResult<IEnumerable<NgayRevenue>>> GetDoanhSoNgayTheoThangAsync([FromForm] string month)
        {
            int year = DateTime.Now.Year;
            int selectedMonth = int.Parse(month);

            // 1. Lấy đơn bán hợp lệ
            var donBans = await _context.HoaDons
                .Where(hd => hd.NgayTao.Year == year &&
                             hd.NgayTao.Month == selectedMonth 
                             && (hd.TrangThai == 2)
                             && hd.IsPayed == true)
                .ToListAsync();

            // 2. Lấy đơn hoàn hàng (trạng thái 8 hoặc 10)
            var donHoans = await _context.HoaDons
                .Where(hd => hd.NgayTao.Year == year &&
                             hd.NgayTao.Month == selectedMonth &&
                             (hd.TrangThai == 8 || hd.TrangThai == 10))
                .ToListAsync();

            // 3. Lấy các đơn con của đơn hoàn hàng
            var parentIds = donHoans.Select(x => x.Id).ToList();

            var donHoanCons = await _context.HoaDons
                .Where(x => x.IdParent != null && parentIds.Contains((int)x.IdParent))
                .ToListAsync();

            // 4. Gộp doanh thu theo ngày
            var result = donBans
                .GroupBy(hd => hd.NgayTao.Date)
                .Select(g => new NgayRevenue
                {
                    Ngay = g.Key,
                    Revenues = g.Sum(hd => hd.TongTien)
                })
                .ToList();

            foreach (var donHoan in donHoans)
            {
                var ngay = donHoan.NgayTao.Date;
                decimal tongCon = donHoanCons
                    .Where(x => x.IdParent == donHoan.Id)
                    .Sum(x => x.TongTien);

                var revenue = result.FirstOrDefault(x => x.Ngay == ngay);
                if (revenue != null)
                    revenue.Revenues += (donHoan.TongTien - tongCon);
                else
                    result.Add(new NgayRevenue
                    {
                        Ngay = ngay,
                        Revenues = donHoan.TongTien - tongCon
                    });
            }

            return result.OrderBy(x => x.Ngay).ToList();
        }


        //Thống kê số sản phẩm số lần xuất hiện trong đơn hàng (bán chạy)
        [HttpGet("topsolanxuathientrongdonhang")]
        public async Task<ActionResult<IEnumerable<TenSPSoLanXuatHienTrongDonHang>>> GetSoLanXuatHienTrongDonHang(DateTime fromDate, DateTime toDate)
        {
            return await _connector.GetSoLanXuatHienTrongDonHang(fromDate, toDate);
        }
        //Sản phẩm bán đạt lợi nhuận cao nhất trong top 10
        [HttpGet("topsanphamloinhattop")]
        public async Task<ActionResult<IEnumerable<TenSanPhamDoanhSo>>> Top10SanPhamLoiNhats(DateTime fromDate, DateTime toDate)
        {
            return await _connector.Top10SanPhamLoiNhats(fromDate, toDate);
        }
        [HttpGet("toptonkho")]
        public async Task<ActionResult<IEnumerable<SanPhamTonKho>>> Top10SanPhamTonNhat()
        {
            return await _connector.Top10SanPhamTonNhats();
        }

        //Tong so luong ban ra trong nam
        [HttpGet("topnhanhieubanchaynhattrongnam")]
        public async Task<ActionResult<IEnumerable<NhanHieuBanChayNhatTrongNam>>> GetNhanHieuBanChayNhatTrongNam()
        {
            return await _connector.GetNhanHieuBanChayNhatTrongNam();
        }
        //$sidebar-nav-link-active-bg; //131
        //Bien the dat doanh thu cao nhat
        [HttpGet("topdatasetbanratonkho")]
        public async Task<ActionResult<IEnumerable<DataSetBanRaTonKho>>> DataDataSetBanRaTonKho()
        {
            return await _connector.DataDataSetBanRaTonKho();
        }
        /// <summary>
        /// Biểu đồ liên quan tới vấn đề nhập hàng
        /// </summary>
        /// <returns></returns>
        [HttpGet("nhacungcaptongtien")]
        public async Task<ActionResult<IEnumerable<NhaCungCapTongTien>>> GetDoanhSoBans(DateTime fromDate, DateTime toDate)
        {
            return await _connector.GetDoanhSoBans(fromDate, toDate);
        }

        [HttpGet("nhacungcapsoluong")]
        public async Task<ActionResult<IEnumerable<NhaCungCapSoLuong>>> GetNhaCungCapSoLuongs(DateTime fromDate, DateTime toDate)
        {
            return await _connector.GetNhaCungCapSoLuongs(fromDate, toDate);
        }

        /* [HttpGet("Report_BanHangTheoSanPham")]
         public async Task<ActionResult<object>> Report_BanHangTheoSanPham()
         *//*  public async Task<object> Report_BanHangTheoSanPham(int clientId, int userId, int idOrganization, int idSupplier, string idBrands, bool byTdv, bool isLeader, string listIdGroup, DateTime? fromDate, DateTime? toDate, string sortField, bool isAsc)*//*
         {
             *//* string IdOrg = idOrganization.ToString();*/

        /*        if (!listIdGroup.Contains(IdOrg))
                {
                    var checkParent = await _context.HoaDons.Where(o => o.Id == idOrganization).Select(o => new { o.Id, o.IdParent }).FirstOrDefaultAsync(); ;

                    if (checkParent != null && !listIdGroup.Contains(checkParent.IdParent.ToString()))
                        idOrganization = -1;

                }*//*


        var result = await _context.SqlQuery<LogHoaDonTop10>("EXEC [dbo].[Report_BanHangTheoSanPham]");
        *//*
                    var result = await _context.SqlQuery<object>("EXEC [dbo].[Report_BanHangTheoSanPham] @ClientId,@UserId,@IdOrganization,@idSupplier,@idBrands,@ByTdv,@IsLeader,@ListIdGroup,@FromDate,@ToDate,@SortField,@IsAsc",
                                                new SqlParameter("ClientId", clientId),
                                                new SqlParameter("UserId", userId),
                                                new SqlParameter("IdOrganization", idOrganization),
                                                new SqlParameter("IdSupplier", idSupplier),
                                                new SqlParameter("IdBrands", idBrands ?? ""),
                                                new SqlParameter("ByTdv", byTdv),
                                                new SqlParameter("IsLeader", isLeader),
                                                new SqlParameter("ListIdGroup", listIdGroup ?? ""),
                                                new SqlParameter("FromDate", fromDate),
                                                new SqlParameter("ToDate", toDate),
                                                new SqlParameter("SortField", sortField ?? ""),
                                                new SqlParameter("IsAsc", isAsc));*/

        /*    var total = new Report_BanHangTheoSanPham
            {
                Quantity = result.Sum(s => s.Quantity),
                QuantityGift = result.Sum(s => s.QuantityGift),
                Total = result.Sum(s => s.Total),
                TotalOrder = result.Sum(s => s.TotalOrder),
                TotalNt = result.Sum(s => s.TotalNt),
            };*/

        /*  return Result<object>.Success(result, result.Count(), dataTotal: total);*//*
        return Result<object>.Success(result);


    }*/


        [HttpGet("Report_BanHangTheoSanPham")]
        public async Task<ActionResult<object>> Report_BanHangTheoSanPham(DateTime startDate, DateTime endDate, int? idCuahang)
        {
            var result = await _context.SqlQuery<Report_DoanhSoCuaHang>(
                "EXEC [dbo].[Report_BanHangTheoSanPham] @FromDate, @ToDate, @IdCuaHang",
                new SqlParameter("@FromDate", startDate),
                new SqlParameter("@ToDate", endDate),
                new SqlParameter("@IdCuaHang", (object?)idCuahang ?? DBNull.Value)
            );
            var total = new Report_DoanhSoCuaHang
            {
                TenCuaHang = result[0].TenCuaHang,
                MaCuaHang = result[0].MaCuaHang,
                DoanhSo = result[0].DoanhSo,
                SoDon = result[0].SoDon,
            };
            return Result<object>.Success(result, result.Count(), dataTotal: total);
        }


        [HttpGet("Report_DoanhSoTheoNhaCungCap")]
        public async Task<ActionResult<object>> Report_DoanhSoTheoNhaCungCap(DateTime startDate, DateTime endDate)
        {
            var result = await _context.SqlQuery<Report_DoanhSoTheoNhaCungCap>(
                "EXEC [dbo].[Report_DoanhSoTheoNhaCungCap] @StartDate, @EndDate",
                new SqlParameter("@StartDate", startDate),
                new SqlParameter("@EndDate", endDate)
            );
            var total = new Report_DoanhSoTheoNhaCungCap
            {
                MaNhaCungCap = 0,
                TenNhaCungCap = "",
                SoDonHang = result.Sum(s => s.SoDonHang),
                DoanhSo = result.Sum(s => s.DoanhSo),
            };
            return Result<object>.Success(result, result.Count(), dataTotal: total);
        }

        [HttpGet("Report_SoLuongSanPhamDaBanTheoKho")]
        public async Task<ActionResult<object>> Report_SoLuongSanPhamDaBanTheoKho()
        {
            var result = await _context.SqlQuery<SanPhamDaBanTheoKhoDto>(
                "EXEC [dbo].[BaoCao_SoLuongSanPhamDaBanTheoKho]"
            );

            var total = new
            {
                TongSoLuong = result.Sum(x => x.TongSoLuongBan),
                TongTien = result.Sum(x => x.TongTien)
            };

            return Result<object>.Success(result, result.Count(), dataTotal: total);
        }


        [HttpGet("Report_ThongKeDonVaHoanHang")]
        public async Task<ActionResult<object>> Report_ThongKeDonVaHoanHang(DateTime startDate, DateTime endDate, int? idCuaHang)
        {
            var result = await _context.SqlQuery<sp_ThongKeDonVaHoanHang>(
                "EXEC [dbo].[sp_ThongKeDonVaHoanHang] @StartDate, @EndDate, @Id_CuaHang",
                new SqlParameter("@StartDate", startDate),
                new SqlParameter("@EndDate", endDate),
                new SqlParameter("@IdCuaHang", (object?)idCuaHang ?? DBNull.Value)
            );
            return Result<object>.Success(result, result.Count());
        }

        [HttpGet("Report_TonKhoCuaHang")]
        public async Task<ActionResult<object>> Report_TonKhoCuaHang(string key, int? idCuaHang, int? idNhaCungCap, string trangThai, int offset, int limit = 100)
        {
            var rawQuery = from spk in _context.SanPhamKho
                           join spbt in _context.SanPhamBienThes on spk.SanPhamBienTheId equals spbt.Id
                           join sp in _context.SanPhams on spbt.Id_SanPham equals sp.Id
                           join kho in _context.Kho on spk.KhoId equals kho.Id
                           where spk.IsDelete == false && sp.IsDelete == false
                           select new TonKhoDto
                           {
                               IdSanPham = sp.Id,
                               IdSanPhamBienThe = spbt.Id,
                               TenSanPham = sp.Ten + ", Size: " + spbt.Size.TenSize + ", Màu: " + spbt.MauSac.MaMau,
                               TenKho = kho.Name,
                               SoLuongTon = spk.SoLuong,
                               SoLuongCanhBao = spk.SoLuongCanhBao,
                               IdKho = kho.Id,
                               IdNhaCungCap = sp.Id_NhaCungCap
                           };

            if (!string.IsNullOrEmpty(key))
                rawQuery = rawQuery.Where(x => x.TenSanPham.Contains(key) || x.TenKho.Contains(key));

            if (idCuaHang.HasValue && idCuaHang.Value != -1)
                rawQuery = rawQuery.Where(x => x.IdKho == idCuaHang.Value);

            if (idNhaCungCap.HasValue && idNhaCungCap.Value != -1)
                rawQuery = rawQuery.Where(x => x.IdNhaCungCap == idNhaCungCap.Value);

            var rawList = await rawQuery.ToListAsync();

            var groupDict = new Dictionary<(int SanPhamBienTheId, int KhoId), TonKhoDto>();

            foreach (var item in rawList)
            {
                var keyGroup = (item.IdSanPhamBienThe, item.IdKho);

                if (groupDict.ContainsKey(keyGroup))
                {
                    groupDict[keyGroup].SoLuongTon += item.SoLuongTon;
                }
                else
                {
                    groupDict[keyGroup] = new TonKhoDto
                    {
                        IdSanPham = item.IdSanPham,
                        IdSanPhamBienThe = item.IdSanPhamBienThe,
                        TenSanPham = item.TenSanPham,
                        TenKho = item.TenKho,
                        SoLuongTon = item.SoLuongTon,
                        SoLuongCanhBao = item.SoLuongCanhBao,
                        IdKho = item.IdKho,
                        IdNhaCungCap = item.IdNhaCungCap
                    };
                }
            }

            var resultList = groupDict.Values.ToList();

            // Lấy dữ liệu số lượng đã bán từ ChiTietHoaDon (bỏ qua đơn bị hủy)
            var queryDaBan = await (
                from cthd in _context.ChiTietHoaDons
                join hd in _context.HoaDons on cthd.Id_HoaDon equals hd.Id
                where hd.IsDelete == false && hd.TrangThai == Statement.HoanThanh // Directly use the database value
                group cthd by new { cthd.Id_SanPhamBienThe, cthd.Id_Kho } into g
                select new
                {
                    IdSanPhamBienThe = g.Key.Id_SanPhamBienThe,
                    IdKho = g.Key.Id_Kho,
                    SoLuongDaBan = g.Sum(x => x.Soluong)
                }).ToListAsync();

            // Gán số lượng đã bán vào kết quả
            foreach (var item in resultList)
            {
                var daBan = queryDaBan.FirstOrDefault(x => x.IdSanPhamBienThe == item.IdSanPhamBienThe && x.IdKho == item.IdKho);
                item.SoLuongDaBan = daBan?.SoLuongDaBan ?? 0;
            }

            // Lọc theo trạng thái
            if (!string.IsNullOrEmpty(trangThai))
            {
                if (trangThai.ToLower() == "conhang")
                    resultList = resultList.Where(x => x.SoLuongTon > 0).ToList();
                else if (trangThai.ToLower() == "cannhap")
                    resultList = resultList.Where(x => x.SoLuongTon <= 0 || x.SoLuongTon < x.SoLuongCanhBao).ToList();
            }

            var totalCount = resultList.Count();

            var paginated = resultList
                .OrderByDescending(x => x.IdSanPhamBienThe)
                .Skip(offset)
                .Take(limit)
                .ToList();

            return Ok(Result<IEnumerable<object>>.Success(paginated, totalCount, ""));
        }



        [HttpGet("Report_Chart_DonHang")]
        public async Task<ActionResult<object>> Report_Chart_DonHang(int? dateType, int? yearNumber, int? monthNumber, int? idShop)
        {
            var query = _context.HoaDons
                .Where(o => o.IsActive == true
                    && (idShop == -1 || o.Id_CuaHang == idShop)
                    && (yearNumber == -1 || o.NgayTao.Year == yearNumber)
                    && (monthNumber == -1 || o.NgayTao.Month == monthNumber));

            var rawData = await query
                .Select(o => new
                {
                    o.TrangThai,
                    o.TongTien,
                    o.NgayTao
                })
                .ToListAsync();

            var grouped = rawData
                .Select(o => new
                {
                    o.TrangThai,
                    o.TongTien,
                    o.NgayTao,
                    Key = dateType switch
                    {
                        0 => o.NgayTao.ToString("dd/MM/yyyy"),
                        1 => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(o.NgayTao, CalendarWeekRule.FirstDay, DayOfWeek.Monday).ToString(),
                        2 => (o.NgayTao.Month).ToString(),
                        3 => (o.NgayTao.Year).ToString(),
                        _ => o.NgayTao.ToString("dd/MM/yyyy")
                    },
                    DateSort = o.NgayTao.Date
                })
                .GroupBy(x => new { x.Key, x.DateSort })
                .Select(g => new
                {
                    CreatedDate = g.Key.Key,
                    OldCreatedDate = g.Key.DateSort,
                    TotalOrder = g.Count(),
                    DonChuaXacNhan = g.Count(x => x.TrangThai == Statement.ChoXacNhan),
                    DonDaXacNhan = g.Count(x => x.TrangThai == Statement.DaXacNhan),
                    DangGiaoHang = g.Count(x => x.TrangThai == Statement.GiaoHang),
                    DonHoanThanh = g.Count(x => x.TrangThai == Statement.HoanThanh),
                    DonDaHuy = g.Count(x => x.TrangThai == Statement.Huy),
                    ChoThanhToan = g.Count(x => x.TrangThai == Statement.ChoThanhToan),
                    TotalBill = g.Where(x => x.TrangThai == Statement.HoanThanh).Sum(x => x.TongTien),
                    ChuaHoanThanh = g.Count(x => x.TrangThai != Statement.HoanThanh && x.TrangThai != Statement.Huy)
                })
                .OrderBy(x => x.OldCreatedDate)
                .ToList();

            return Ok(Result<object>.Success(grouped, grouped.Count, ""));
        }

    }
}
