using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Models;
using API.Helper.Result;
using API.Helpers;
using API.Dtos.ModelRequest;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietHoaDonsController : Controller
    {
        private readonly DPContext _context;
        public ChiTietHoaDonsController(DPContext context)
        {
            this._context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChiTietHoaDon>>> ChiTetHoaDons()
        {
            return await _context.ChiTietHoaDons.ToListAsync();
        }
        [HttpPost("chitiethoadon/{id}")]
        public async Task<ActionResult> ChitietHoaDon(int id)
        {
            var resuft = _context.ChiTietHoaDons.Where(d => d.Id_HoaDon == id)
            .Select(
            d => new ChiTietHoaDon
            {
                GiaBan = d.GiaBan,
                Soluong = d.Soluong,
                Mau = d.Mau,
                Size = d.Size,
                SanPham = _context.SanPhams.FirstOrDefault(t => t.Id == d.Id_SanPham),
            }
            );
            var r = await resuft.ToListAsync();
            return  Ok(Result<object>.Success(r, 1, " "));
        }
        [HttpPost("huydon/{id}")]
        public async Task<ActionResult> HuyDon(int id)
        {

            var resuft = await _context.HoaDons.Where(d => d.Id == id).SingleOrDefaultAsync();
            var ct = await _context.ChiTietHoaDons.Where(c => c.Id_HoaDon == resuft.Id).ToListAsync();
            foreach (var chiTiet in ct)
            {
                var sanPhamBienThe = await _context.SanPhamBienThes.Where(c => c.Id == chiTiet.Id_SanPhamBienThe).SingleOrDefaultAsync();

                if (sanPhamBienThe != null)
                {
                    sanPhamBienThe.SoLuongTon += chiTiet.Soluong;
                }

            }
                resuft.TrangThai = 3;
            await _context.SaveChangesAsync();
            return Json(resuft);
        }
        [HttpPost("hoandon/{id}")]
        public async Task<ActionResult> HoanDon(int id)
        {

            var resuft = await _context.HoaDons.Where(d => d.Id == id).SingleOrDefaultAsync();
            resuft.TrangThai = Statement.YeuCauHoanHang;
            await _context.SaveChangesAsync();
            return Json(resuft);
        }

        [HttpPost("hoandonNote")]
        public async Task<ActionResult> HoanDonNote(HoanDonNote form)
        {

            var crrHoaDon = await _context.HoaDons.Where(d => d.Id == form.Id).SingleOrDefaultAsync();

            crrHoaDon.GhiChuHoanHang = form.Note;

            crrHoaDon.TrangThai = Statement.YeuCauHoanHang;

            await _context.SaveChangesAsync();

            return Json(crrHoaDon);
        }

        [HttpPost("thongtintaikhoan/{id}")]
        public async Task<ActionResult> ThongTinTaiKhoan(string idUser)
        {
            var resuft = await _context.AppUsers.Where(d => d.Id == idUser).Select(d => new ThongTinTaiKhoan
            {
                Ho = d.FirstName,
                Ten = d.LastName,
                DiaChi = d.DiaChi,
                SoDienThoai = d.SDT
            }).FirstOrDefaultAsync();
            return Json(resuft);
        }
    }
}
