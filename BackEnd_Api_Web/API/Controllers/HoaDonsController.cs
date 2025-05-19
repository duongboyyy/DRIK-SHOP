using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using OfficeOpenXml;
using Syncfusion.XlsIO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Helpers;
using API.Models;
using API.Helper.SignalR;
using API.Helper.Result;
using System.Reflection;
using API.Helper;
using API.Services;
using Microsoft.Owin.BuilderProperties;
using API.Dtos.ModelRequest;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using API.Migrations;
using Org.BouncyCastle.Asn1.X509.Qualified;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoaDonsController : Controller
    {
        private readonly DPContext _context;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        private readonly IDataConnector _connector;
        private readonly IHoaDonsService _hdService;
        public HoaDonsController(DPContext context, IHubContext<BroadcastHub, IHubClient> hubContext, IDataConnector connector, IHoaDonsService hdService)
        {
            _context = context;
            _hubContext = hubContext;
            _connector = connector;
            _hdService = hdService;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDonUser>>> AllHoaDons(string key, int id_cuahang, int? isPayed,  int? loaiDon, int? trangThai, DateTime? startDate, DateTime? endDate, int offset, int limit = 20, string sortField = "", string sortOrder = "desc")
        {
            var query = _context.HoaDons
                        .Where(hd => hd.IsActive == true && hd.IsDelete == false
                            && (id_cuahang <= 0 || hd.Id_CuaHang == id_cuahang)
                            && (!startDate.HasValue || hd.NgayTao.Date >= startDate.Value.Date)
                            && (!endDate.HasValue || hd.NgayTao.Date <= endDate.Value.Date)
                            && (!loaiDon.HasValue || loaiDon <= 0 || hd.LoaiDon == loaiDon)
                            && (!trangThai.HasValue || trangThai < 0 || hd.TrangThai == trangThai)
                            && (!isPayed.HasValue || isPayed == -1 || hd.IsPayed == (isPayed == 1))
                        )
                        .GroupJoin(
                            _context.AppUsers,
                            hd => hd.Id_User,
                            us => us.Id,
                            (hd, users) => new { hd, users }
                        )
                        .SelectMany(
                            temp => temp.users.DefaultIfEmpty(),
                            (temp, us) => new HoaDonUser
                            {
                                GhiChu = temp.hd.GhiChu,
                                Id = temp.hd.Id,
                                MaHoaDon = temp.hd.MaHoaDon,
                                NgayTao = temp.hd.NgayTao,
                                TrangThai = temp.hd.TrangThai,
                                TongTien = temp.hd.TongTien,
                                DaLayTien = temp.hd.IsPayed == true ? "rồi" : "chưa",
                                LoaiThanhToan = temp.hd.LoaiThanhToan == 2 ? "Thanh toán online" : "Tiền mặt",
                                FullName = us != null
                                    ? (!string.IsNullOrEmpty(us.FirstName) || !string.IsNullOrEmpty(us.LastName)
                                        ? (us.FirstName + " " + us.LastName)
                                        : temp.hd.TenKhachHang ?? "Không rõ")
                                    : temp.hd.TenKhachHang ?? "Không rõ",
                                IsPayed = temp.hd.IsPayed,
                            }
                        )
                        .Where(hd => string.IsNullOrEmpty(key) || hd.MaHoaDon.Contains(key) || hd.FullName.Contains(key));

            //query = query.OrderByDescending(hd => hd.Id);
            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField)
                {
                    case "maHoaDon":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.MaHoaDon) : query.OrderByDescending(s => s.MaHoaDon);
                        break;
                    case "ngayTao":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.NgayTao) : query.OrderByDescending(s => s.NgayTao);
                        break;
                    case "tongTien":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.TongTien) : query.OrderByDescending(s => s.TongTien);
                        break;
                    case "trangThai":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.TrangThai) : query.OrderByDescending(s => s.TrangThai);
                        break;
                    default:
                        query = query.OrderBy(s => s.Id);
                        break;
                }
            }
            else
            {
                query = query.OrderByDescending(s => s.Id);
            }

            query = query.Skip(offset).Take(limit);

            var totalCount = await _context.HoaDons
                 .Where(hd => hd.IsActive == true && hd.IsDelete == false)
                 .Join(_context.AppUsers,
                       hd => hd.Id_User,
                       us => us.Id,
                       (hd, us) => new { hd, us })
                 .Where(joined => string.IsNullOrEmpty(key) || joined.hd.MaHoaDon.Contains(key) || (joined.us.FirstName + " " + joined.us.LastName).Contains(key))
                 .CountAsync();

            var results = await query.ToListAsync();

            return Ok(Result<IEnumerable<HoaDonUser>>.Success(results, totalCount, ""));
        }

        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<HoaDonUser>>> AllHoaDons()
        //{
        //    var kb = from hd in _context.HoaDons
        //             join us in _context.AppUsers
        //             on hd.Id_User equals us.Id
        //             select new HoaDonUser()
        //             {
        //                 GhiChu = hd.GhiChu,
        //                 Id = hd.Id,
        //                 NgayTao = hd.NgayTao,
        //                 TrangThai = hd.TrangThai,
        //                 TongTien = hd.TongTien,
        //                 FullName = us.FirstName + ' ' + us.LastName,
        //             };
        //    return await kb.ToListAsync();
        //}

        [HttpGet("admindetailorder/{id}")]
        public async Task<ActionResult<MotHoaDon>> HoaDonDetailAsync(int id)
        {
            return await _connector.HoaDonDetailAsync(id);
        }
        
        [HttpGet("hoadon/{id}")]
        public async Task<ActionResult> ChitietHoaDon(int id)
        {
            var resuft = await _context.HoaDons.Where(d => d.Id == id).FirstOrDefaultAsync();

            if (resuft == null)
            {
                return Ok(Result<object>.Error("Hóa đơn không tồn tại."));
            }

            resuft.User = await _context.AppUsers.Where(d => d.Id == resuft.Id_User).FirstOrDefaultAsync();


            return Ok(Result<object>.Success(resuft, 1, ""));
        }
        
        [HttpPost("danhsachhoadon")]
        public async Task<ActionResult> ListHoaDon(UserDto user)
        {
            var resuft = await _context.HoaDons.Where(d => d.Id_User == user.idUser)
                .OrderByDescending(d => d.NgayTao).ToListAsync();
            return Json(resuft);
        }

        [HttpPut("suatrangthai/{id}")]
        public async Task<IActionResult> SuaTrangThai(int id, [FromForm] IFormCollection upload)
        {
            var hoadon = await _context.HoaDons.FindAsync(id);

            if (hoadon == null)
            {
                return NotFound();
            }

            //if (hoadon.TrangThai == Statement.HoanHangThanhCong || hoadon.TrangThai == Statement.HoanHangTatCa || hoadon.TrangThai == Statement.HoanHangMotPhan || hoadon.TrangThai == Statement.Huy)
            //{
            //    return Ok(Result<object>.Error("Đơn đã đóng ko thể chuyển trạng thái"));
            //}

            var trangThai = upload["TrangThai"];

            if (int.Parse(trangThai) == Statement.Huy && hoadon.TrangThai != Statement.Huy)
            {
                var ct = await _context.ChiTietHoaDons.Where(c => c.Id_HoaDon == hoadon.Id).ToListAsync();

                foreach (var chiTiet in ct)
                {
                    var sanPhamBienThe = await _context.SanPhamBienThes.Where(c => c.Id == chiTiet.Id_SanPhamBienThe).SingleOrDefaultAsync();

                    var spKho = await _context.SanPhamKho.Where(s => s.MaLo == chiTiet.MaLo && s.KhoId == chiTiet.Id_Kho).FirstOrDefaultAsync();

                    if (sanPhamBienThe != null)
                    {
                        spKho.SoLuong += chiTiet.Soluong;
                        sanPhamBienThe.SoLuongTon += chiTiet.Soluong;
                    }

                }
            }

            if (hoadon.TrangThai == Statement.Huy && int.Parse(trangThai) != Statement.Huy)
            {
                var ct = await _context.ChiTietHoaDons.Where(c => c.Id_HoaDon == hoadon.Id).ToListAsync();

                foreach (var chiTiet in ct)
                {
                    var sanPhamBienThe = await _context.SanPhamBienThes.Where(c => c.Id == chiTiet.Id_SanPhamBienThe).SingleOrDefaultAsync();
                    var spKho = await _context.SanPhamKho.Where(s => s.MaLo == chiTiet.MaLo && s.KhoId == chiTiet.Id_Kho).FirstOrDefaultAsync();

                    if (sanPhamBienThe != null)
                    {
                        spKho.SoLuong -= chiTiet.Soluong;
                        sanPhamBienThe.SoLuongTon -= chiTiet.Soluong;
                    }

                }
            }

            if (hoadon.TrangThai != Statement.HoanHangTatCa && (int.Parse(trangThai) == Statement.HoanHangTatCa || int.Parse(trangThai) == Statement.HoanHangMotPhan))
            {
                var jsonChiTietHoanHangs = upload["ChiTietHoanHangs"];

                if (string.IsNullOrEmpty(jsonChiTietHoanHangs))
                {
                    return BadRequest("ChiTietHoanHangs is missing");
                }

                List<ChiTietHoanHangRequest> chiTietList;
                try
                {
                    chiTietList = JsonConvert.DeserializeObject<List<ChiTietHoanHangRequest>>(jsonChiTietHoanHangs);
                }
                catch (Exception ex)
                {
                    return Ok(Result<object>.Error(ex.Message));
                }

                HoaDon HD = new HoaDon()
                {
                    MaHoaDon = "HDBH",
                    TrangThai = Statement.HoanHangThanhCong,
                    GhiChu = hoadon.GhiChuHoanHang,
                    NgayTao = DateTime.Now,
                    TenKhachHang = hoadon.TenKhachHang,
                    SDT = hoadon.SDT,
                    Tinh = hoadon.Tinh,
                    Huyen = hoadon.Huyen,
                    Xa = hoadon.Xa,
                    DiaChi = hoadon.DiaChi,
                    IsActive = true,
                    IsDelete = false,
                    LoaiThanhToan = hoadon.LoaiThanhToan,
                    IsPayed = hoadon.IsPayed,
                    LoaiDon = hoadon.LoaiDon,
                    MaCuaHang = hoadon.MaCuaHang,
                    Id_CuaHang = hoadon.Id_CuaHang,
                    IdParent = hoadon.Id,
                    TypeHoaDon = 1,
                    Id_User = hoadon.Id_User
                };

                _context.HoaDons.Add(HD);
                await _context.SaveChangesAsync();
                HD.MaHoaDon = "HDBH" + HD.Id;
                double tongTien = 0;
                var ct = await _context.ChiTietHoaDons.Where(c => c.Id_HoaDon == hoadon.Id).ToListAsync();

                foreach (var chiTiet in chiTietList)
                {
                    var sph = ct.Where(c => c.Id == chiTiet.Id_ChiTietHoaDon).FirstOrDefault();
                    var sanPhamBienThe = await _context.SanPhamBienThes.Where(c => c.Id == sph.Id_SanPhamBienThe).SingleOrDefaultAsync();
                    var spKho = await _context.SanPhamKho.Where(s => s.MaLo == sph.MaLo && s.KhoId == sph.Id_Kho).FirstOrDefaultAsync();

                    ChiTietHoaDon cthd = new ChiTietHoaDon
                    {
                        Id_SanPham = sph.Id_SanPham,
                        Id_SanPhamBienThe = sph.Id_SanPhamBienThe,
                        Id_HoaDon = HD.Id,
                        GiaBan = sph.GiaBan,
                        Soluong = chiTiet.SoLuongHoan,
                        ThanhTien = (sph.GiaBan ?? 0) * chiTiet.SoLuongHoan,
                        Size = sph.Size,
                        Mau = sph.Mau,
                        MaLo = sph.MaLo,
                        Id_Kho = sph.Id_Kho,
                        CreatedDate = DateTime.Now,
                        IsActive = true,
                        IsDelete = false,
                        IsRefund = true,
                        SoLuongDaHoan = chiTiet.SoLuongHoan,
                        IsBack=chiTiet.IsBack
                        
                    };

                    _context.ChiTietHoaDons.Add(cthd);

                    if (sanPhamBienThe != null && chiTiet.IsBack==true)
                    {
                        spKho.SoLuong += chiTiet.SoLuongHoan;
                        sanPhamBienThe.SoLuongTon += chiTiet.SoLuongHoan;
                        sph.IsRefund = true;
                        sph.SoLuongDaHoan = chiTiet.SoLuongHoan;
                    }

                    tongTien += (double)(cthd.Soluong * cthd.GiaBan);

                }

                HD.TongTien = (decimal)tongTien;
            }

            hoadon.TrangThai = int.Parse(trangThai);

            if (int.Parse(trangThai) == Statement.HoanThanh)
            {
                hoadon.IsPayed = true;
            }

            await _context.SaveChangesAsync();
            //await _hubContext.Clients.All.BroadcastMessage();
            return Ok(Result<object>.Success(hoadon, 1, ""));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<ChiTietHoaDonSanPhamBienTheViewModel>>> GetChiTietHoaDonSanPhamBienTheViewModel(int id)
        {
            var kb = from spbt in _context.SanPhamBienThes
                     join sp in _context.SanPhams
                     on spbt.Id_SanPham equals sp.Id
                     join cthd in _context.ChiTietHoaDons
                     on spbt.Id equals cthd.Id_SanPhamBienThe
                     join hd in _context.HoaDons
                     on cthd.Id_HoaDon equals hd.Id
                     join size in _context.Sizes
                     on spbt.SizeId equals size.Id
                     join mau in _context.MauSacs
                     on spbt.Id_Mau equals mau.Id
                     select new ChiTietHoaDonSanPhamBienTheViewModel()
                     {
                         IdCTHD = cthd.Id,
                         TenSanPham = sp.Ten,
                         //HinhAnh = spbt.ImagePath,
                         GiaBan = (decimal)sp.GiaBan,
                         SoLuong = cthd.Soluong,
                         ThanhTien = (decimal)cthd.ThanhTien,
                         Id_HoaDon = (int)cthd.Id_HoaDon,
                         TenMau = mau.MaMau,
                         TenSize = size.TenSize,
                     };
            return await kb.Where(s => s.Id_HoaDon == id).ToListAsync();
        }
        
        [HttpGet("magiamgia")]
        public async Task<ActionResult<IEnumerable<MaGiamGia>>> MaGiamGia()
        {
            var r= await _context.MaGiamGias.ToListAsync();
            return Ok(Result<object>.Success(r, 1,""));
        }
        
        [HttpPut("magiamgia")]
        public async Task<ActionResult> SuaMaGiamGia( int id)
        {
            MaGiamGia maGiamGia;
            maGiamGia = await _context.MaGiamGias.FindAsync(id);
            if (maGiamGia.SoLuong < 0)
            {
                return BadRequest("hết mã giảm giá");
            }
            maGiamGia.SoLuong = maGiamGia.SoLuong - 1;
            _context.Update(maGiamGia);
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.BroadcastMessage();
            return Ok(Result<object>.Success(maGiamGia, 1, "Cập nhật thành công !!!"));
        }

        [HttpPost]
        public async Task<IActionResult> TaoHoaDon(UploadOrder hd)
        {
            if ((hd == null || hd.SpOrder == null || !hd.SpOrder.Any()) && hd.LoaiDon!=1)
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }

            dynamic obj = new AppUser();
            if (hd.Tinh == null && hd.Xa == null && hd.Huyen == null)
            {
                obj = await _context.AppUsers
                    .Where(s => s.Id.Equals(hd.Id_User))
                    .Select(u => new { u.Tinh, u.Huyen, u.Xa })
                    .FirstOrDefaultAsync();
            }

            string diaChiaLatLng = hd.Tinh == null && hd.Xa == null && hd.Huyen == null
                ? $"{obj.Xa}, {obj.Huyen}, {obj.Tinh}"
                : $"{hd.Xa}, {hd.Huyen}, {hd.Tinh}";

            var latLng = await Lib.GetLatLngFromAddressAsync(diaChiaLatLng);

            if (latLng == null && hd.LoaiDon!=1)
            {
                return BadRequest("Không thể lấy tọa độ địa chỉ giao hàng.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            HoaDon hoaDon = new HoaDon()
            {
                MaHoaDon = "HDBH",
                TrangThai = hd.TrangThai ?? Statement.ChoXacNhan,
                GhiChu = hd.GhiChu,
                Id_User = hd.Id_User,
                NgayTao = DateTime.Now,
                Tinh = hd.Tinh ?? obj?.Tinh,
                Huyen = hd.Huyen ?? obj?.Huyen,
                Xa = hd.Xa ?? obj?.Xa,
                DiaChi = hd.DiaChi,
                TongTien = hd.TongTien,
                IsActive = true,
                IsDelete = false,
                LoaiThanhToan = hd.LoaiThanhToan ?? 0,
                IsPayed = hd.IsPayed ?? false,
                LoaiDon = hd.LoaiDon ?? LoaiDon.DonOnline,
                TenKhachHang=hd.TenKhachHang,
                SDT=hd.SDT
            };

            _context.HoaDons.Add(hoaDon);
            await _context.SaveChangesAsync();
            hoaDon.MaHoaDon = "HDBH" + hoaDon.Id;

            NotificationCheckout notification = new NotificationCheckout()
            {
                ThongBaoMaDonHang = hoaDon.Id,
            };
           _context.NotificationCheckouts.Add(notification);

            if (hd.LoaiDon == 1)
            {
                foreach (var item in hd.ChiTietHoaDons)
                {
                    if (true)
                    {
                        var thisSanPhamBienThe = await _context.SanPhamBienThes.FindAsync(item.Id);
                        

                        var khoSanPhams = await _context.SanPhamKho
                            .FromSqlRaw(@"
                    SELECT spk.* FROM SanPhamKho spk WITH (UPDLOCK, ROWLOCK)
                    INNER JOIN Kho k ON spk.KhoId = k.Id
                    WHERE spk.SanPhamBienTheId = {0} AND spk.SoLuong > 0 AND spk.IsDelete = 0", item.Id)
                            .Include(x => x.Kho)
                            .ToListAsync();

                        if (!khoSanPhams.Any())
                        {
                            return BadRequest($"Sản phẩm không còn trong kho.");
                        }

                        var khoSapXep = khoSanPhams
                            .Select(x => new {
                                SanPhamKho = x,
                                Kho = x.Kho,
                                //Distance = Lib.GetDistance(latLng.Value.Lat, latLng.Value.Lng, (double)x.Kho.Lat, (double)x.Kho.Lng),
                                DaysUntilExpiry = (x.NgayHetHan - DateTime.Now)?.TotalDays ?? double.MaxValue
                            })
                            .OrderBy(x => x.DaysUntilExpiry)
                            //.ThenBy(x => x.Distance)
                            .ThenByDescending(x => x.SanPhamKho.SoLuong)
                            .ToList();

                        var totalAvailable = khoSapXep.Sum(x => x.SanPhamKho.SoLuong);
                        if (totalAvailable < item.Soluong)
                        {
                            return BadRequest($"Số lượng tồn kho của sản phẩm  không đủ. Tổng còn: {totalAvailable}");
                        }

                        var usedBatches = new List<(string MaLo, int KhoId, int SoLuong)>();
                        int remainingQuantity = item.Soluong;

                        foreach (var kho in khoSapXep)
                        {
                            if (remainingQuantity <= 0) break;

                            var quantityToDeduct = Math.Min(kho.SanPhamKho.SoLuong, remainingQuantity);
                            kho.SanPhamKho.SoLuong -= quantityToDeduct;
                            remainingQuantity -= quantityToDeduct;
                            thisSanPhamBienThe.SoLuongTon -= quantityToDeduct;

                            usedBatches.Add((kho.SanPhamKho.MaLo, kho.Kho.Id, quantityToDeduct));
                            _context.Entry(kho.SanPhamKho).State = EntityState.Modified;
                        }

                        foreach (var batch in usedBatches)
                        {
                            ChiTietHoaDon cthd = new ChiTietHoaDon
                            {
                                Id_SanPham = item.Id_SanPham,
                                Id_SanPhamBienThe = item.Id_SanPhamBienThe,
                                Id_HoaDon = hoaDon.Id,
                                GiaBan = item.GiaBan,
                                Soluong = batch.SoLuong,
                                ThanhTien = item.GiaBan * batch.SoLuong,
                                Size = item.Size,
                                Mau = item.Mau,
                                MaLo = batch.MaLo,
                                Id_Kho = batch.KhoId,
                                IsActive = true,
                                IsDelete = false,
                                CreatedDate = DateTime.Now,
                            };

                            _context.ChiTietHoaDons.Add(cthd);
                        }

                        //_context.Carts.Remove(item);
                    }
                }
            }
            else
            {
                var cart = _context.Carts.Where(d => d.UserID == hd.Id_User).ToList();

                foreach (var item in cart)
                {
                    if (hd.SpOrder.Contains(item.CartID))
                    {
                        var thisSanPhamBienThe = await _context.SanPhamBienThes.FindAsync(item.Id_SanPhamBienThe);
                        var thisSanPham = await _context.SanPhams.FindAsync(item.SanPhamId);
                        if (thisSanPham == null || thisSanPhamBienThe == null)
                        {
                            return BadRequest($"Sản phẩm không hợp lệ.");
                        }

                        var khoSanPhams = await _context.SanPhamKho
                            .FromSqlRaw(@"
                    SELECT spk.* FROM SanPhamKho spk WITH (UPDLOCK, ROWLOCK)
                    INNER JOIN Kho k ON spk.KhoId = k.Id
                    WHERE spk.SanPhamBienTheId = {0} AND spk.SoLuong > 0 AND spk.IsDelete = 0", item.Id_SanPhamBienThe)
                            .Include(x => x.Kho)
                            .ToListAsync();

                        if (!khoSanPhams.Any())
                        {
                            return BadRequest($"Sản phẩm {thisSanPham.Ten} không còn trong kho.");
                        }

                        var khoSapXep = khoSanPhams
                            .Select(x => new {
                                SanPhamKho = x,
                                Kho = x.Kho,
                                Distance = Lib.GetDistance(latLng.Value.Lat, latLng.Value.Lng, (double)x.Kho.Lat, (double)x.Kho.Lng),
                                DaysUntilExpiry = (x.NgayHetHan - DateTime.Now)?.TotalDays ?? double.MaxValue
                            })
                            .OrderBy(x => x.DaysUntilExpiry)
                            .ThenBy(x => x.Distance)
                            .ThenByDescending(x => x.SanPhamKho.SoLuong)
                            .ToList();

                        var totalAvailable = khoSapXep.Sum(x => x.SanPhamKho.SoLuong);
                        if (totalAvailable < item.SoLuong)
                        {
                            return BadRequest($"Số lượng tồn kho của sản phẩm {thisSanPham.Ten} không đủ. Tổng còn: {totalAvailable}");
                        }

                        var usedBatches = new List<(string MaLo, int KhoId, int SoLuong)>();
                        int remainingQuantity = item.SoLuong;

                        foreach (var kho in khoSapXep)
                        {
                            if (remainingQuantity <= 0) break;

                            var quantityToDeduct = Math.Min(kho.SanPhamKho.SoLuong, remainingQuantity);
                            kho.SanPhamKho.SoLuong -= quantityToDeduct;
                            remainingQuantity -= quantityToDeduct;
                            thisSanPhamBienThe.SoLuongTon -= quantityToDeduct;

                            usedBatches.Add((kho.SanPhamKho.MaLo, kho.Kho.Id, quantityToDeduct));
                            _context.Entry(kho.SanPhamKho).State = EntityState.Modified;
                        }

                        foreach (var batch in usedBatches)
                        {
                            ChiTietHoaDon cthd = new ChiTietHoaDon
                            {
                                Id_SanPham = item.SanPhamId,
                                Id_SanPhamBienThe = item.Id_SanPhamBienThe,
                                Id_HoaDon = hoaDon.Id,
                                GiaBan = item.Gia,
                                Soluong = batch.SoLuong,
                                ThanhTien = item.Gia * batch.SoLuong,
                                Size = item.Size,
                                Mau = item.Mau,
                                MaLo = batch.MaLo,
                                Id_Kho = batch.KhoId,
                                IsActive = true,
                                IsDelete = false,
                                CreatedDate = DateTime.Now,
                            };

                            _context.ChiTietHoaDons.Add(cthd);
                        }

                        _context.Carts.Remove(item);
                    }
                }
            }
            

            await _context.SaveChangesAsync();
            await transaction.CommitAsync(); // ✅ commit cuối cùng

            await _hubContext.Clients.All.BroadcastMessage();
            return Ok(Result<HoaDon>.Success(hoaDon));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoaDons(int id)
        {
            ChiTietHoaDon[] cthd;
            cthd = _context.ChiTietHoaDons.Where(s => s.Id_HoaDon == id).ToArray();
            _context.ChiTietHoaDons.RemoveRange(cthd);
            HoaDon hd;
            hd = await _context.HoaDons.FindAsync(id);
            _context.HoaDons.Remove(hd);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("hoan-hang")]
        public async Task<IActionResult> TaoPhieuHoanHang(PhieuHoanHangRequest request)
        {
            var hoaDon = await _context.HoaDons.Include(h => h.ChiTietHoaDons)
                .FirstOrDefaultAsync(h => h.Id == request.Id_HoaDon);

            if (hoaDon == null)
                return NotFound("Hóa đơn không tồn tại.");

            // Tạo phiếu hoàn hàng
            var phieuHoan = new PhieuHoanHang
            {
                MaPhieuHoan = "PH" + DateTime.Now.Ticks,
                Id_HoaDon = request.Id_HoaDon,
                NgayHoan = DateTime.Now,
                LyDo = request.LyDo,
                TongTienHoan = 0,
                TrangThai = TrangThaiHoanHang.ChoXuLy, // Chờ xử lý
                Id_User = request.Id_User,
                CreatedDate = DateTime.Now,
                IsActive = true,
                Id_CuaHang = request.Id_CuaHang,
            };

            _context.PhieuHoanHang.Add(phieuHoan);

            await _context.SaveChangesAsync();

            decimal tongTienHoan = 0;

            foreach (var item in request.ChiTietHoanHangs)
            {
                var chiTietHoaDon = hoaDon.ChiTietHoaDons.FirstOrDefault(c => c.Id == item.Id_ChiTietHoaDon);
                if (chiTietHoaDon == null) continue;

                // Kiểm tra số lượng hợp lệ
                if (chiTietHoaDon.SoLuongDaHoan + item.SoLuongHoan > chiTietHoaDon.Soluong)
                {
                    return BadRequest("Số lượng hoàn không hợp lệ.");
                }

                // Tạo chi tiết phiếu hoàn hàng
                var chiTietHoan = new ChiTietPhieuHoanHang
                {
                    Id_PhieuHoanHang = phieuHoan.Id,
                    Id_ChiTietHoaDon = item.Id_ChiTietHoaDon,
                    SoLuongHoan = item.SoLuongHoan,
                    DonGiaHoan = (decimal)chiTietHoaDon.GiaBan,
                    Id_SanPhamBienThe = chiTietHoaDon.Id_SanPhamBienThe,
                    Id_Kho = chiTietHoaDon.Id_Kho,
                    MaLo = chiTietHoaDon.MaLo,
                    IsActive = true,
                    CreatedDate = DateTime.Now,

                };

                tongTienHoan += (decimal)(item.SoLuongHoan * chiTietHoaDon.GiaBan);

                _context.ChiTietPhieuHoanHang.Add(chiTietHoan);

                // Cập nhật số lượng đã hoàn hàng
                chiTietHoaDon.SoLuongDaHoan += item.SoLuongHoan;

                // Cập nhật số lượng tồn kho
                //var sanPham = await _context.SanPhamBienThes.FindAsync(chiTietHoaDon.Id_SanPhamBienThe);
                //if (sanPham != null)
                //{
                //    sanPham.SoLuongTon += item.SoLuongHoan;
                //}
            }

            phieuHoan.TongTienHoan = tongTienHoan;
            await _context.SaveChangesAsync();

            return Ok(Result<object>.Success(phieuHoan, 1, "Phiếu hoàn hàng đã được tạo."));
        }

        [HttpPost("update-trangthai")]
        public async Task<IActionResult> ChangeTrangThaiHoanHang(UpdateStatmentRefund request)
        {
            var phieuHoan = await _context.PhieuHoanHang
                .Include(p => p.ChiTietPhieuHoanHangs)
                .FirstOrDefaultAsync(p => p.Id == request.Id_HoaDon);

            if (phieuHoan == null)
            {
                return Ok(Result<object>.Success(null, 0, "Phiếu hoàn không tồn tại."));
            }

            if (request.Id_TrangThai == TrangThaiHoanHang.DaXacNhan)
            {
                // Cập nhật trạng thái phiếu hoàn
                phieuHoan.TrangThai = TrangThaiHoanHang.DaXacNhan;
            }

            if(request.Id_TrangThai == TrangThaiHoanHang.Huy)
            {
                phieuHoan.TrangThai = TrangThaiHoanHang .Huy;
                phieuHoan.NoteTrangThai = "Sản phẩm khách gửi về không đúng mô tả!!!";
            }

            if(request.Id_TrangThai == TrangThaiHoanHang.HoanTat)
            {
                if (request.ListSanPhamBienThe.Count() > 0)
                {
                    // Duyệt qua từng chi tiết phiếu hoàn
                    foreach (var chiTiet in phieuHoan.ChiTietPhieuHoanHangs)
                    {
                        // Kiểm tra nếu sản phẩm trong chi tiết phiếu hoàn nằm trong ListSanPhamBienThe
                        if (request.ListSanPhamBienThe.Contains((int)chiTiet.Id_SanPhamBienThe))
                        {
                            // Cập nhật kho: Tìm sản phẩm trong kho tương ứng với kho và sản phẩm
                            var sanPhamKho = await _context.SanPhamKho
                                .FirstOrDefaultAsync(k => k.SanPhamBienTheId == chiTiet.Id_SanPhamBienThe && k.KhoId == chiTiet.Id_Kho && k.MaLo == chiTiet.MaLo);

                            if (sanPhamKho != null)
                            {
                                // Cập nhật số lượng tồn kho tại kho xuất (giảm số lượng)
                                sanPhamKho.SoLuong += chiTiet.SoLuongHoan;
                            }
                            else
                            {

                                var sanPhamKhoNhap = new SanPhamKho
                                {
                                    KhoId = (int)chiTiet.Id_Kho, // Kho nhập (có thể giống kho xuất)
                                    SanPhamBienTheId = chiTiet.SanPhamBienTheId,
                                    SoLuong = chiTiet.SoLuongHoan,
                                    CreatedDate = DateTime.Now,
                                    MaLo = chiTiet.MaLo,
                                    IsDelete = false,
                                };

                                _context.Add(sanPhamKhoNhap);
                            }
                            chiTiet.DuocHoan = true;
                        }
                    }
                }
                else
                {
                    // Duyệt qua từng chi tiết phiếu hoàn
                    foreach (var chiTiet in phieuHoan.ChiTietPhieuHoanHangs)
                    {
                        // Cập nhật kho: Tìm sản phẩm trong kho tương ứng với kho và sản phẩm
                        var sanPhamKho = await _context.SanPhamKho
                            .FirstOrDefaultAsync(k => k.SanPhamBienTheId == chiTiet.Id_SanPhamBienThe && k.KhoId == chiTiet.Id_Kho && k.MaLo == chiTiet.MaLo);

                        if (sanPhamKho != null)
                        {
                            // Cập nhật số lượng tồn kho tại kho xuất (giảm số lượng)
                            sanPhamKho.SoLuong += chiTiet.SoLuongHoan;
                        }
                        else
                        {

                            var sanPhamKhoNhap = new SanPhamKho
                            {
                                KhoId = (int)chiTiet.Id_Kho,
                                SanPhamBienTheId = chiTiet.SanPhamBienTheId,
                                SoLuong = chiTiet.SoLuongHoan,
                                CreatedDate = DateTime.Now,
                                MaLo = chiTiet.MaLo,
                                IsDelete = false
                            };

                            _context.Add(sanPhamKhoNhap);
                        }
                        chiTiet.DuocHoan = true;
                    }
                }
            }
            // Lưu các thay đổi
            await _context.SaveChangesAsync();
            //await _hubContext.Clients.All.BroadcastMessage();
            return Ok(Result<object>.Success(phieuHoan, 1, "Đã hoàn hàng thành công."));
        }

        [HttpPost("tao-hoa-don-cua-hang")]
        public async Task<IActionResult> PostHoaDonCuaHang(RequestPostDHCuaHang hd)
        {
            if (hd == null || hd.SpOrder == null || !hd.SpOrder.Any())
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }

            var cuaHang = await _context.CuaHang.Where(c => c.Id == hd.IdCuaHang).Select(c => new { c.MaCuaHang }).FirstOrDefaultAsync();

            var statement = 0;
            var loaiThanhToan = 0;
            bool dathanhToan = false;

            if (hd.LoaiDon == LoaiDon.DonOnline)
            {
                statement = Statement.DaXacNhan;
                loaiThanhToan = 2;
            }
            else if (hd.LoaiDon == LoaiDon.DonOffline)
            {
                statement = Statement.HoanThanh;
                loaiThanhToan = 1;
                dathanhToan = true;
            }

                HoaDon hoaDon = new HoaDon()
                {
                    MaHoaDon = "HDBH",
                    TrangThai = statement,
                    GhiChu = hd.GhiChu,
                    NgayTao = DateTime.Now,
                    TenKhachHang = hd.TenKhachHang,
                    SDT = hd.SDT,
                    Tinh = hd.Tinh,
                    Huyen = hd.Huyen,
                    Xa = hd.Xa,
                    DiaChi = hd.DiaChi,
                    TongTien = hd.TongTien,
                    IsActive = true,
                    IsDelete = false,
                    LoaiThanhToan = loaiThanhToan,
                    IsPayed = dathanhToan,
                    LoaiDon = hd.LoaiDon,
                    MaCuaHang = cuaHang.MaCuaHang,
                    Id_CuaHang = hd.IdCuaHang
                };

            _context.HoaDons.Add(hoaDon);
            await _context.SaveChangesAsync();
            hoaDon.MaHoaDon = "HDBH" + hoaDon.Id;

            NotificationCheckout notification = new NotificationCheckout()
            {
                ThongBaoMaDonHang = hoaDon.Id,
            };
            _context.NotificationCheckouts.Add(notification);
            foreach (var item in hd.SpOrder)
            {
                // Lấy tất cả các lô hàng của sản phẩm biến thể này trong kho của cửa hàng
                var khoSanPhams = await _context.SanPhamKho
                    .Where(spk => spk.SanPhamBienTheId == item.Id_SanPhamBienThe && spk.SoLuong > 0 && spk.Kho.IdCuaHang == hd.IdCuaHang)
                    .Join(_context.Kho, spk => spk.KhoId, k => k.Id, (spk, k) => new { spk, k })
                    .ToListAsync();

                if (!khoSanPhams.Any())
                {
                    return Ok(Result<object>.Success(null, 0, $"Sản phẩm {item.TenSanPham} không còn trong kho."));
                }

                // Tính toán và sắp xếp theo đúng thứ tự ưu tiên
                var khoSapXep = khoSanPhams
                    .Select(x => new
                    {
                        SanPhamKho = x.spk,
                        Kho = x.k,
                        DaysUntilExpiry = (x.spk.NgayHetHan - DateTime.Now)?.TotalDays ?? double.MaxValue
                    })
                    .OrderBy(x => x.DaysUntilExpiry)    // Ưu tiên 1: Hạn sử dụng gần nhất
                    .ThenByDescending(x => x.SanPhamKho.SoLuong) // Ưu tiên 2: Số lượng lớn nhất
                    .ToList();

                // Tính tổng số lượng tồn kho
                var totalAvailable = khoSapXep.Sum(x => x.SanPhamKho.SoLuong);
                if (totalAvailable < item.SoLuong)
                {
                    return Ok(Result<object>.Success(null, 0, $"Số lượng tồn kho của sản phẩm {item.TenSanPham} không đủ. Tổng còn: {totalAvailable}"));
                }

                // Tạo danh sách lưu các lô đã sử dụng
                var usedBatches = new List<(string MaLo, int KhoId, int SoLuong)>();

                // Phân bổ số lượng theo đúng ưu tiên
                int remainingQuantity = item.SoLuong;
                foreach (var kho in khoSapXep)
                {
                    if (remainingQuantity <= 0) break;

                    var quantityToDeduct = Math.Min(kho.SanPhamKho.SoLuong, remainingQuantity);
                    kho.SanPhamKho.SoLuong -= quantityToDeduct;
                    remainingQuantity -= quantityToDeduct;

                    // Lưu thông tin lô đã sử dụng
                    usedBatches.Add((kho.SanPhamKho.MaLo, kho.Kho.Id, quantityToDeduct));

                    _context.Entry(kho.SanPhamKho).State = EntityState.Modified;
                }

                // Tạo chi tiết hóa đơn cho từng lô (nếu sản phẩm lấy từ nhiều lô)
                foreach (var batch in usedBatches)
                {
                    ChiTietHoaDon cthd = new ChiTietHoaDon
                    {
                        Id_SanPham = item.Id_SanPham,
                        Id_SanPhamBienThe = item.Id_SanPhamBienThe,
                        Id_HoaDon = hoaDon.Id,
                        GiaBan = item.Gia ?? 0, // Nếu Giá sản phẩm không có thì mặc định là 0
                        Soluong = batch.SoLuong,
                        ThanhTien = (item.Gia ?? 0) * batch.SoLuong,
                        Size = item.Size,
                        Mau = item.Mau,
                        MaLo = batch.MaLo,
                        Id_Kho = batch.KhoId,
                        CreatedDate = DateTime.Now,
                        IsActive = true,
                        IsDelete = false,

                    };

                    _context.ChiTietHoaDons.Add(cthd);
                }
            }

            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.BroadcastMessage();
            return Ok(Result<HoaDon>.Success(hoaDon));
        }
    }
}
