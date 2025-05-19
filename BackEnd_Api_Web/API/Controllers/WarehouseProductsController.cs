using API.Data;
using API.Dtos;
using API.Dtos.ModelRequest;
using API.Helper.Result;
using API.Helper.SignalR;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseProductsController : ControllerBase
    {
        private readonly DPContext _Db;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        public WarehouseProductsController(DPContext context, IHubContext<BroadcastHub, IHubClient> hubContext)
        {
            _Db = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> Gets(string key, int offset, int limit = 20, string sortField = "", string sortOrder = "asc")
        {
            var query = _Db.SanPhamKho
                .Where(spk => spk.IsDelete == false)
                .Select(spk => new
                {
                    spk.Id,
                    spk.SanPhamBienTheId,
                    Image = spk.SanPhamBienThe != null ? _Db.SanPhams
                        .Where(sp => sp.Id == spk.SanPhamBienThe.Id_SanPham)
                        .Select(sp => sp.ImageSanPhams.Where(q => q.IdSanPham == sp.Id).Select(q => q.ImageName).FirstOrDefault())
                        .FirstOrDefault() : null,
                    TenSanPhamBienThe = spk.SanPhamBienThe != null ? _Db.SanPhams
                        .Where(sp => sp.Id == spk.SanPhamBienThe.Id_SanPham)
                        .Select(sp => sp.Ten)
                        .FirstOrDefault() : null,
                    Mau= spk.SanPhamBienThe != null ? _Db.MauSacs
                        .Where(sp => sp.Id == spk.SanPhamBienThe.Id_Mau)
                        .Select(sp => sp.MaMau)
                        .FirstOrDefault() : null,
                    Size= spk.SanPhamBienThe != null ? _Db.Sizes
                        .Where(sp => sp.Id == spk.SanPhamBienThe.SizeId)
                        .Select(sp => sp.TenSize)
                        .FirstOrDefault() : null,
                    spk.KhoId,
                    TenKho = spk.Kho != null ? spk.Kho.Name : null, // Lấy tên kho
                    spk.SoLuong,
                    spk.CreatedDate,
                    spk.UpdatedDate,
                    spk.DeletedDate
                })
                .Where(spk => string.IsNullOrEmpty(key) ||
                              (spk.TenSanPhamBienThe != null && spk.TenSanPhamBienThe.Contains(key)) ||
                              (spk.TenKho != null && spk.TenKho.Contains(key)));

            // Sắp xếp
            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField.ToLower())
                {
                    case "tensanpham":
                        query = sortOrder == "asc" ? query.OrderBy(spk => spk.TenSanPhamBienThe) : query.OrderByDescending(spk => spk.TenSanPhamBienThe);
                        break;
                    case "tenkho":
                        query = sortOrder == "asc" ? query.OrderBy(spk => spk.TenKho) : query.OrderByDescending(spk => spk.TenKho);
                        break;
                    case "soluong":
                        query = sortOrder == "asc" ? query.OrderBy(spk => spk.SoLuong) : query.OrderByDescending(spk => spk.SoLuong);
                        break;
                    case "createddate":
                        query = sortOrder == "asc" ? query.OrderBy(spk => spk.CreatedDate) : query.OrderByDescending(spk => spk.CreatedDate);
                        break;
                    default:
                        query = query.OrderBy(spk => spk.Id);
                        break;
                }
            }
            else
            {
                query = query.OrderBy(spk => spk.Id);
            }

            var totalCount = await query.CountAsync();
            var results = await query.Skip(offset).Take(limit).ToListAsync();

            return Ok(Result<IEnumerable<object>>.Success(results, totalCount, ""));
        }

        // POST: api/SanPhamKho
        //[HttpPost]
        //public async Task<IActionResult> Save([FromForm] UploadSanPhamKho form)
        //{
        //    SanPhamKho obj;
        //    if (form.Id > 0)
        //    {
        //        // Cập nhật
        //        obj = await _Db.SanPhamKho.FindAsync(form.Id);

        //        if (obj == null)
        //            return Ok(Result<object>.Success(null, 0, "Không tìm thấy sản phẩm kho với Id này."));

        //        obj.SanPhamBienTheId = form.SanPhamBienTheId;
        //        obj.KhoId = form.KhoId;
        //        obj.SoLuong = form.SoLuong;
        //        obj.UpdatedDate = DateTime.Now;
        //    }
        //    else
        //    {
        //        // Thêm mới
        //        obj = new SanPhamKho
        //        {
        //            SanPhamBienTheId = form.SanPhamBienTheId,
        //            KhoId = form.KhoId,
        //            SoLuong = form.SoLuong,
        //            IsDelete = false,
        //            CreatedDate = DateTime.Now,
        //            UpdatedDate = null,
        //            DeletedDate = null
        //        };
        //        _Db.SanPhamKho.Add(obj);
        //    }

        //    // Kiểm tra SanPhamBienTheId và KhoId có tồn tại không
        //    var sanPhamBienThe = await _Db.SanPhamBienThes.FindAsync(form.SanPhamBienTheId);
        //    if (sanPhamBienThe == null)
        //        return BadRequest(Result<object>.Failure("Sản phẩm biến thể không tồn tại."));

        //    var kho = await _Db.Khos.FindAsync(form.KhoId);
        //    if (kho == null)
        //        return BadRequest(Result<object>.Failure("Kho không tồn tại."));

        //    await _Db.SaveChangesAsync();

        //    // Cập nhật SoLuongTon trong SanPhamBienThe
        //    sanPhamBienThe.SoLuongTon = await _Db.SanPhamKhos
        //        .Where(spk => spk.SanPhamBienTheId == sanPhamBienThe.Id && !spk.IdDelete)
        //        .SumAsync(spk => spk.SoLuong);
        //    _Db.SanPhamBienThes.Update(sanPhamBienThe);
        //    await _Db.SaveChangesAsync();

        //    return Ok(Result<SanPhamKho>.Success(obj, 1, "Lưu thành công"));
        //}

        [HttpPost("Transfer")]
        public async Task<IActionResult> TransferWareHose([FromForm] TransferSanPhamKho form)
        {
            // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
            using (var transaction = await _Db.Database.BeginTransactionAsync())
            {
                try
                {
                    // 1. Kiểm tra kho nguồn và sản phẩm
                    var sanPhamKhoNguon = await _Db.SanPhamKho
                        .FirstOrDefaultAsync(spk => spk.Id == form.IdSanPhamKhoNguon && (bool)!spk.IsDelete);
                    if (sanPhamKhoNguon == null)
                        Ok(Result<object>.Success(null, 0, "Không tìm thấy sản phẩm kho với Id này."));

                    var khoNguon = await _Db.Kho.FindAsync(sanPhamKhoNguon.KhoId);
                    if (khoNguon == null)
                        Ok(Result<object>.Success(null, 0, "Kho nguồn không tồn tại."));

                    // 2. Kiểm tra kho đích
                    var khoDich = await _Db.Kho.FindAsync(form.KhoIdDich);
                    if (khoDich == null)
                        Ok(Result<object>.Success(null, 0, "Kho đích không tồn tại."));

                    // 3. Kiểm tra số lượng chuyển
                    if (form.SoLuongChuyen <= 0)
                        Ok(Result<object>.Success(null, 0, "Số lượng chuyển phải lớn hơn 0."));

                    if (form.SoLuongChuyen > sanPhamKhoNguon.SoLuong)
                        Ok(Result<object>.Success(null, 0, "Số lượng chuyển vượt quá số lượng hiện có trong kho nguồn."));

                    // 4. Kiểm tra sản phẩm biến thể
                    var sanPhamBienThe = await _Db.SanPhamBienThes.FindAsync(sanPhamKhoNguon.SanPhamBienTheId);
                    if (sanPhamBienThe == null)
                        Ok(Result<object>.Success(null, 0, "Sản phẩm biến thể không tồn tại."));

                    // 5. Xử lý kho đích
                    var sanPhamKhoDich = await _Db.SanPhamKho
                        .FirstOrDefaultAsync(spk => spk.KhoId == form.KhoIdDich &&
                                                  spk.SanPhamBienTheId == sanPhamKhoNguon.SanPhamBienTheId &&
                                                  (bool)!spk.IsDelete);

                    if (sanPhamKhoDich != null)
                    {
                        // Cộng số lượng vào kho đích nếu đã tồn tại
                        sanPhamKhoDich.SoLuong += form.SoLuongChuyen;
                        sanPhamKhoDich.UpdatedDate = DateTime.Now;
                        _Db.SanPhamKho.Update(sanPhamKhoDich);
                    }
                    else
                    {
                        // Tạo mới bản ghi trong kho đích nếu chưa tồn tại
                        sanPhamKhoDich = new SanPhamKho
                        {
                            SanPhamBienTheId = sanPhamKhoNguon.SanPhamBienTheId,
                            KhoId = form.KhoIdDich,
                            SoLuong = form.SoLuongChuyen,
                            IsDelete = false,
                            CreatedDate = DateTime.Now,
                            UpdatedDate = null,
                            DeletedDate = null
                        };
                        _Db.SanPhamKho.Add(sanPhamKhoDich);
                    }

                    // 6. Cập nhật kho nguồn
                    sanPhamKhoNguon.SoLuong -= form.SoLuongChuyen;
                    sanPhamKhoNguon.UpdatedDate = DateTime.Now;
                    // Không xóa bản ghi khi SoLuong = 0, giữ lịch sử
                    _Db.SanPhamKho.Update(sanPhamKhoNguon);

                    // 7. Cập nhật tổng số lượng tồn trong SanPhamBienThe
                    sanPhamBienThe.SoLuongTon = await _Db.SanPhamKho
                        .Where(spk => spk.SanPhamBienTheId == sanPhamBienThe.Id && (bool)!spk.IsDelete)
                        .SumAsync(spk => spk.SoLuong);
                    _Db.SanPhamBienThes.Update(sanPhamBienThe);

                    // 8. Lưu thay đổi và commit transaction
                    await _Db.SaveChangesAsync();
                    await transaction.CommitAsync();

                    // 9. Trả về kết quả
                    return Ok(Result<object>.Success(new
                    {
                        Source = sanPhamKhoNguon,
                        Destination = sanPhamKhoDich
                    }, 1, "Chuyển kho thành công"));
                }
                catch (Exception ex)
                {
                    // Rollback nếu có lỗi
                    await transaction.RollbackAsync();
                    return Ok(Result<object>.Success(null, 0, $"Lỗi khi chuyển kho: {ex.Message}"));
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromForm] UploadSanPhamKho form)
        {
            try
            {
                // 1. Kiểm tra sản phẩm biến thể
                var sanPhamBienThe = await _Db.SanPhamBienThes.FindAsync(form.SanPhamBienTheId);
                if (sanPhamBienThe == null)
                    return Ok(Result<object>.Error("Sản phẩm biến thể không tồn tại."));

                // 2. Kiểm tra kho
                var kho = await _Db.Kho.FindAsync(form.KhoId);
                if (kho == null)
                    return Ok(Result<object>.Error("Kho không tồn tại."));

                // 3. Kiểm tra số lượng
                if (form.SoLuong < 0)
                    return Ok(Result<object>.Error("Số lượng không được nhỏ hơn 0."));

                SanPhamKho sanPhamKho;

                if (form.Id > 0)
                {
                    // Sửa bản ghi hiện có
                    sanPhamKho = await _Db.SanPhamKho
                        .FirstOrDefaultAsync(spk => spk.Id == form.Id && (bool)!spk.IsDelete);
                    if (sanPhamKho == null)
                        return Ok(Result<object>.Error("Không tìm thấy sản phẩm kho với Id này."));

                    // Cập nhật thông tin
                    sanPhamKho.SanPhamBienTheId = form.SanPhamBienTheId;
                    sanPhamKho.KhoId = form.KhoId;
                    sanPhamKho.SoLuong = form.SoLuong;
                    sanPhamKho.UpdatedDate = DateTime.Now;
                    _Db.SanPhamKho.Update(sanPhamKho);
                }
                else
                {
                    // Thêm mới
                    // Kiểm tra xem sản phẩm đã tồn tại trong kho chưa
                    sanPhamKho = await _Db.SanPhamKho
                        .FirstOrDefaultAsync(spk => spk.KhoId == form.KhoId &&
                                                  spk.SanPhamBienTheId == form.SanPhamBienTheId &&
                                                  (bool)!spk.IsDelete);
                    if (sanPhamKho != null)
                        return Ok(Result<object>.Error("Sản phẩm này đã tồn tại trong kho. Vui lòng sử dụng chức năng sửa."));

                    // Tạo bản ghi mới
                    sanPhamKho = new SanPhamKho
                    {
                        SanPhamBienTheId = form.SanPhamBienTheId,
                        KhoId = form.KhoId,
                        SoLuong = form.SoLuong,
                        IsDelete = false,
                        CreatedDate = DateTime.Now,
                        UpdatedDate = null,
                        DeletedDate = null
                    };
                    _Db.SanPhamKho.Add(sanPhamKho);
                }

                // 4. Cập nhật tổng số lượng tồn trong SanPhamBienThe
                sanPhamBienThe.SoLuongTon = await _Db.SanPhamKho
                    .Where(spk => spk.SanPhamBienTheId == sanPhamBienThe.Id && (bool)!spk.IsDelete)
                    .SumAsync(spk => spk.SoLuong);
                _Db.SanPhamBienThes.Update(sanPhamBienThe);

                // 5. Lưu thay đổi trực tiếp
                await _Db.SaveChangesAsync();

                // 6. Trả về kết quả
                return Ok(Result<SanPhamKho>.Success(sanPhamKho, 1, form.Id > 0 ? "Cập nhật sản phẩm kho thành công" : "Thêm mới sản phẩm kho thành công"));
            }
            catch (Exception ex)
            {
                return Ok(Result<object>.Error($"Lỗi khi lưu sản phẩm kho: {ex.Message}"));
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<SanPhamBienTheKho>> GetWareHouseProductById(int id)
        {
            var query = from k in _Db.SanPhamKho
                        join g in _Db.SanPhamBienThes on k.SanPhamBienTheId equals g.Id
                        join kh in _Db.Kho on k.KhoId equals kh.Id
                        join m in _Db.MauSacs on g.Id_Mau equals m.Id
                        join sp in _Db.SanPhams on g.Id_SanPham equals sp.Id
                        join s in _Db.Sizes on g.SizeId equals s.Id
                        where g.IsActive == true && g.IsDelete == false && k.Id==id
                        select new SanPhamBienTheKho
                        {
                            Id = k.Id,
                            KhoId=k.KhoId,
                            TenFull = sp.Ten + "-" + m.MaMau + "-" + s.TenSize,
                            SoLuong = k.SoLuong,
                            TenKho=kh.Name,
                            SanPhamBienTheId=k.SanPhamBienTheId,
                            IsActive = k.IsActive,
                            IsDelete = k.IsDelete,
                            CreatedDate = k.CreatedDate,
                            DeletedDate = k.DeletedDate,
                            UpdatedDate = k.UpdatedDate,
                        };
            
            var results = await query.FirstOrDefaultAsync();

            return Ok(Result<SanPhamBienTheKho>.Success(results));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var obj = await _Db.SanPhamKho.FindAsync(id);
            obj.IsActive = false;
            obj.IsDelete = true;
            obj.DeletedDate = DateTime.Now;
            await _Db.SaveChangesAsync();
            return Ok(Result<object>.Success(obj));
        }

        [HttpPut("Sync")]
        public async Task<IActionResult> Sync([FromBody] SyncQuantityProductRequest obj)
        {

            var tongSoLuong = await _Db.SanPhamKho
                .Where(spk => spk.SanPhamBienTheId == obj.IdSanPhamBienThe && spk.Kho.IdCuaHang == null && spk.IsDelete==false)
                .SumAsync(spk => spk.SoLuong);

            if (tongSoLuong == 0 || tongSoLuong == null)
                return Ok(Result<object>.Success(null, 0, "Không có sản phẩm trong kho để đồng bộ."));
            

            var sanPhamBienThe = await _Db.SanPhamBienThes.FindAsync(obj.IdSanPhamBienThe);

            if (sanPhamBienThe == null)
                return Ok(Result<object>.Success(null, 0, "Không tìm thấy sản phẩm"));

            sanPhamBienThe.SoLuongTon = tongSoLuong;

            _Db.SanPhamBienThes.Update(sanPhamBienThe);

            await _Db.SaveChangesAsync();

            return Ok(Result<object>.Success(new
            {
                IdSanPhamBienThe = obj.IdSanPhamBienThe,
                TongSoLuong = tongSoLuong
            }, 1, "Đồng bộ thành công"));
        }

    }
}
