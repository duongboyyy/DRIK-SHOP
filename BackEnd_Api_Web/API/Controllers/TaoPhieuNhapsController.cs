using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Models;
using API.Helper;
using API.Helper.SignalR;
using API.Helper.Result;
using API.Migrations;
using API.Helpers;
using API.Dtos.ModelRequest;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaoPhieuNhapsController : ControllerBase
    {
        private readonly DPContext _context;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        public TaoPhieuNhapsController(DPContext context, IHubContext<BroadcastHub, IHubClient> hubContext)
        {
            this._context = context;
            this._hubContext = hubContext;
        }
        [HttpGet("sanpham/{id}")]
        public async Task<ActionResult<IEnumerable<SanPham>>> GetAllSanPhams(UploadNhaCungCap uploadNhaCungCap)
        {
            return await _context.SanPhams.ToListAsync();
        }
        [HttpGet("sanphambienthe")]
        public async Task<ActionResult<IEnumerable<SanPhamBienThe>>> GetAllSanPhamBienThe()
        {
            return await _context.SanPhamBienThes.ToListAsync();
        }
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<PhieuNhapHangNhaCungCap>>> GetAllPhieuNhap()
        //{
        //    var kb = from ncc in _context.NhaCungCaps
        //             join pnh in _context.PhieuNhapHangs
        //             on ncc.Id equals pnh.Id_NhaCungCap
        //             join us in _context.AppUsers
        //             on pnh.NguoiLapPhieu equals us.Id
        //             select new PhieuNhapHangNhaCungCap()
        //             {
        //                 Id = pnh.Id,
        //                 GhiChu = pnh.GhiChu,
        //                 NgayTao = pnh.NgayTao,
        //                 NguoiLapPhieu = us.FirstName +' '+us.LastName,
        //                 SoChungTu = pnh.SoChungTu,
        //                 TenNhaCungCap = ncc.Ten,
        //                 TongTien = pnh.TongTien,
        //             };
        //    return await kb.ToListAsync();
        //}
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllPhieuNhap(string key, int? idNcc, int? isPayment, DateTime? startDate, DateTime? endDate, int offset, int limit = 20, string sortField = "", string sortOrder = "asc")
        {
            var query = _context.PhieuNhapHangs
                 .Where(hd => hd.IsActive == true && hd.IsDelete == false
                            && (!startDate.HasValue || hd.NgayTao.Date >= startDate.Value.Date)
                            && (!endDate.HasValue || hd.NgayTao.Date <= endDate.Value.Date)
                            && (!isPayment.HasValue || isPayment == -1 || hd.IsPayment == (isPayment == 1))
                            && (idNcc <=0 || hd.Id_NhaCungCap == idNcc)
                        )
                .Join(_context.AppUsers,
                      pnh => pnh.NguoiLapPhieu,
                      us => us.Id,
                      (pnh, us) => new { pnh, us })
                .Join(_context.NhaCungCaps,
                      result => result.pnh.Id_NhaCungCap,
                      ncc => ncc.Id,
                      (result, ncc) => new
                      {
                          Id = result.pnh.Id,
                          GhiChu = result.pnh.GhiChu,
                          NgayTao = result.pnh.NgayTao,
                          NguoiLapPhieu = result.us.FirstName + ' ' + result.us.LastName,
                          SoChungTu = result.pnh.SoChungTu,
                          TenNhaCungCap = ncc.Ten,
                          TongTien = result.pnh.TongTien,
                          IsPayment = result.pnh.IsPayment,
                          CongNo = result.pnh.CongNo
                      })
                .Where(pnh => string.IsNullOrEmpty(key) || pnh.NguoiLapPhieu.Contains(key) || pnh.TenNhaCungCap.Contains(key));

            // Xử lý sắp xếp
            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField)
                {
                    case "tenNhaCungCap":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.TenNhaCungCap) : query.OrderByDescending(s => s.TenNhaCungCap);
                        break;
                    case "ngayTao":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.NgayTao) : query.OrderByDescending(s => s.NgayTao);
                        break;
                    case "tongTien":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.TongTien) : query.OrderByDescending(s => s.TongTien);
                        break;
                    case "nguoiLapPhieu":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.NguoiLapPhieu) : query.OrderByDescending(s => s.NguoiLapPhieu);
                        break;
                    default:
                        query = query.OrderBy(s => s.Id);
                        break;
                }
            }
            else
            {
                query = query.OrderByDescending(s => s.NgayTao);
            }

            query = query.Skip(offset).Take(limit);

            // Truy vấn đếm số lượng
            var totalCount = await _context.PhieuNhapHangs
                .Join(_context.AppUsers,
                      pnh => pnh.NguoiLapPhieu,
                      us => us.Id,
                      (pnh, us) => new { pnh, us })
                .Join(_context.NhaCungCaps,
                      result => result.pnh.Id_NhaCungCap,
                      ncc => ncc.Id,
                      (result, ncc) => new { result, ncc })
                .Where(pnh => string.IsNullOrEmpty(key) ||
                              (pnh.result.us.FirstName + ' ' + pnh.result.us.LastName).Contains(key) ||
                              pnh.ncc.Ten.Contains(key))
                .CountAsync(); // Đảm bảo gọi CountAsync() sau khi toàn bộ query đã được hoàn thành

            // Lấy dữ liệu
            var results = await query.ToListAsync();

            return Ok(Result<IEnumerable<object>>.Success(results, totalCount, "lấy thành công "));
        }

        [HttpPost("SanPhamNhaCungCap")]
        public async Task<ActionResult<IEnumerable<SanPham>>> GetSanPhamNhaCungCaps(NhaCungCap ncc)
        {
          return await _context.SanPhams.Where(s => s.Id_NhaCungCap == ncc.Id&& s.IsActive == true && s.IsDelete == false).ToListAsync();
        }
        [HttpPost("NhaCungCap")]
        public async Task<ActionResult<NhaCungCap>> GetNhaCungCaps(NhaCungCap ncc)
        {
            return await _context.NhaCungCaps.FindAsync(ncc.Id);
        }

        [HttpPost("SanPhamBienTheMauSizeLoai")]
        public async Task<ActionResult<IEnumerable<SanPhamBienTheMauSizeLoai>>> GetTenSanPhamBienThe(SanPham sps)
        {
            var kb = from spbt in _context.SanPhamBienThes
                     join sp in _context.SanPhams.Where(s => s.Id==sps.Id  )
                     on spbt.Id_SanPham equals sp.Id
                     join l in _context.Loais
                     on sp.Id_Loai equals l.Id
                     join m in _context.MauSacs
                     on spbt.Id_Mau equals m.Id
                     join s in _context.Sizes
                     on spbt.SizeId equals s.Id
                     select new SanPhamBienTheMauSizeLoai()
                     {
                         Id = spbt.Id,
                         TenSanPhamBienTheMauSize = "Mã:"+spbt.Id+", "+sp.Ten + ", Loại:" + l.Ten + ", Màu sắc:" + m.MaMau + ", Kích cỡ:" + s.TenSize,
                         GiaNhap = (decimal)sp.GiaNhap,
                     };
            return await kb.ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> PostTaoPhieuNhap(UploadPhieuNhapHang uploadPhieuNhap)
        {
            if (uploadPhieuNhap.ChiTietPhieuNhaps?.Count == 0)
            {
                return Ok("Phiếu nhập không hợp lệ");
            }

            var phieuNhap = new PhieuNhapHang()
            {
                NguoiLapPhieu = uploadPhieuNhap.NguoiLapPhieu,
                NgayTao = DateTime.Now,
                Id_NhaCungCap = int.Parse(uploadPhieuNhap.IdNhaCungCap),
                SoChungTu = StringHelper.RandomString(7),
                TongTien = uploadPhieuNhap.TongTien,
                GhiChu = uploadPhieuNhap.GhiChu,
                CongNo = uploadPhieuNhap.IsPayment != true ? uploadPhieuNhap.TongTien : 0,
                IsPayment = uploadPhieuNhap.IsPayment,
                LoaiPhieu = LoaiPhieuNhap.NhapVeTuNCC,
                IsActive = true,
                IsDelete = false,
            };
            _context.Add(phieuNhap);

            foreach (var chitietupload in uploadPhieuNhap.ChiTietPhieuNhaps)
            {
                var maSPBT = StringHelper.XuLyIdSPBTMa(chitietupload.TenSanPhamBienThe);

                var maLo = $"{DateTime.Now:yyMMdd}MSPBT{maSPBT}KHO{chitietupload.IdKho}-{DateTime.Now:HHmmss}";

                var ctpn = new ChiTietPhieuNhapHang()
                {
                    Id_SanPhamBienThe = maSPBT,
                    ThanhTienNhap = chitietupload.GiaNhapSanPhamBienThe * chitietupload.SoLuongNhap,
                    Id_PhieuNhapHang = phieuNhap.Id,
                    SoluongNhap = chitietupload.SoLuongNhap,
                    Id_Kho = chitietupload.IdKho,
                    CreatedDate = DateTime.Now,
                    MaLo = maLo,
                    PhieuNhapHang = phieuNhap,
                    IsDelete = false,
                    IsActive = true
                };
                _context.Add(ctpn);

                var spbt = await _context.SanPhamBienThes.FindAsync(maSPBT);
                if (spbt != null)
                {
                    spbt.SoLuongTon += chitietupload.SoLuongNhap;
                }

                _context.Add(new SanPhamKho
                {
                    SoLuong = chitietupload.SoLuongNhap,
                    IsDelete = false,
                    CreatedDate = DateTime.Now,
                    KhoId = chitietupload.IdKho,
                    SanPhamBienTheId = maSPBT,
                    NgaySanXuat = chitietupload.NgaySanXuat,
                    NgayHetHan = chitietupload.NgayHetHan,
                    MaLo = maLo,
                    ChiTietPhieuNhapHang = ctpn
                });
            }

            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.BroadcastMessage();

            var nhaCungCap = await _context.NhaCungCaps
                .FirstOrDefaultAsync(ncc => ncc.Id == phieuNhap.Id_NhaCungCap);

            var nguoiLapPhieu = await _context.AppUsers
                .FirstOrDefaultAsync(nlp => nlp.Id == phieuNhap.NguoiLapPhieu);

            var result = new
            {
                phieuNhap.Id,
                nguoiLapPhieu = $"{nguoiLapPhieu?.FirstName} {nguoiLapPhieu?.LastName}",
                tenNhaCungCap = nhaCungCap?.Ten,
                phieuNhap.SoChungTu,
                phieuNhap.NgayTao,
                phieuNhap.TongTien,
                phieuNhap.GhiChu,
            };

            return Ok(result);
        }

/*        [HttpPost("chuyen-kho")]
        public async Task<IActionResult> ChuyenKho(UploadPhieuNhapHang uploadPhieuNhap)
        {
            if (uploadPhieuNhap.ChiTietPhieuNhaps?.Count == 0)
            {
                return Ok("Phiếu nhập không hợp lệ");
            }

        }*/

        [HttpGet("{id}")]
        public async Task<ActionResult<PhieuNhapChiTietPhieuNhap>> GetDetailPhieuNhapAsync(int id)
        {
            // Lấy chi tiết phiếu nhập với thông tin sản phẩm & kho
            var listDetail = await (
                from ctpn in _context.ChiTietPhieuNhapHangs
                join spbt in _context.SanPhamBienThes on ctpn.Id_SanPhamBienThe equals spbt.Id
                join sp in _context.SanPhams on spbt.Id_SanPham equals sp.Id
                join l in _context.Loais on sp.Id_Loai equals l.Id
                join m in _context.MauSacs on spbt.Id_Mau equals m.Id
                join s in _context.Sizes on spbt.SizeId equals s.Id
                join kho in _context.Kho on ctpn.Id_Kho equals kho.Id
                where ctpn.Id_PhieuNhapHang == id
                select new
                {
                    Id = spbt.Id,
                    TenSanPhamBienTheMauSize = sp.Ten + " " + s.TenSize + " " + m.MaMau,
                    GiaNhap = (decimal)sp.GiaNhap,
                    SoluongNhap = ctpn.SoluongNhap,
                    ThanhTienNhap = ctpn.ThanhTienNhap,
                    Id_PhieuNhapHang = (int)ctpn.Id_PhieuNhapHang,
                    TenKho = kho.Name, // Lấy tên kho
                    MaLo = ctpn.MaLo,
                }
            ).ToListAsync();

            // Lấy thông tin phiếu nhập
            var phieuNhap = await (
                from phieunhap in _context.PhieuNhapHangs
                join us in _context.AppUsers on phieunhap.NguoiLapPhieu equals us.Id
                join uss in _context.AppUsers on phieunhap.NguoiCapNhat equals uss.Id
                join ncc in _context.NhaCungCaps on phieunhap.Id_NhaCungCap equals ncc.Id
                where phieunhap.Id == id
                select new
                {
                    Id = phieunhap.Id,
                    GhiChu = phieunhap.GhiChu,
                    NgayTao = phieunhap.NgayTao,
                    SoChungTu = phieunhap.SoChungTu,
                    TongTien = phieunhap.TongTien,
                    NguoiLapPhieu = us.LastName + " " + us.FirstName,
                    NguoiCapNhat = uss.LastName + " " + uss.FirstName,
                    IsPayment = phieunhap.IsPayment,
                    CongNo = phieunhap.CongNo,
                    NgayCapNhat = phieunhap.UpdatedDate,
                    NhaCungCap = new NhaCungCap
                    {
                        Id = ncc.Id,
                        Ten = ncc.Ten,
                        DiaChi = ncc.DiaChi,
                        ThongTin = ncc.ThongTin,
                        SDT = ncc.SDT
                    },
                    ChiTietPhieuNhaps = listDetail
                }
            ).FirstOrDefaultAsync();

            return phieuNhap == null ? NotFound() : Ok(phieuNhap);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhieuNhap(int id)
        {
            ChiTietPhieuNhapHang[] ctnh;
            ctnh = _context.ChiTietPhieuNhapHangs.Where(s => s.Id_PhieuNhapHang == id).ToArray();
            //_context.ChiTietPhieuNhapHangs.RemoveRange(ctnh);
            foreach (var chiTiet in ctnh)
            {
                var sanPhamBienThe = await _context.SanPhamBienThes.FindAsync(chiTiet.Id_SanPhamBienThe);
                if (sanPhamBienThe != null)
                {
                    sanPhamBienThe.SoLuongTon -= chiTiet.SoluongNhap;
                }
            }

            // Xóa các chi tiết phiếu nhập
            _context.ChiTietPhieuNhapHangs.RemoveRange(ctnh);
            PhieuNhapHang nh;
            nh = await _context.PhieuNhapHangs.FindAsync(id);
            _context.PhieuNhapHangs.Remove(nh);
            await _context.SaveChangesAsync();
            return Ok(Result<object>.Success(nh));
        }

        [HttpPost("UpdateMultiCongNo")]
        public async Task<IActionResult> UpdateMultiCongNo([FromBody] UpdateCongNoRequestMulti request)
        {
            if (request?.DanhSachPhieu == null || !request.DanhSachPhieu.Any())
                return Ok(Result<object>.Error("Không có dữ liệu để cập nhật!"));

            var danhSachPhieu = await _context.PhieuNhapHangs
                .Where(x => request.DanhSachPhieu.Contains(x.Id))
                .ToListAsync();

            foreach (var item in danhSachPhieu)
            {
                item.IsPayment = true;
                item.CongNo = 0;
                item.NguoiCapNhat = request.UserId;
                item.UpdatedDate = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            return Ok(Result<object>.Success(null, 0, "Cập nhật thành công!"));
        }



        [HttpPost("UpdateCongNo")]
        public async Task<IActionResult> UpdateCongNo(UpdateCongNo form)
        {

            var data = await _context.PhieuNhapHangs.FindAsync(form.Id);

            data.IsPayment = form.payment;
            data.CongNo = form.payment ? 0 : data.TongTien;
            data.NguoiCapNhat = form.UserId;
            data.UpdatedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(Result<object>.Success(data, 0, "Cập nhật thành công!"));
        }

    }
}
