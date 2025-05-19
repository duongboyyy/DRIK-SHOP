using API.Data;
using API.Dtos;
using API.Helper;
using API.Helper.Result;
using API.Helper.SignalR;
using API.Migrations;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CTKMsController : ControllerBase
    {
        private readonly DPContext _context;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        public CTKMsController(DPContext context, IHubContext<BroadcastHub, IHubClient> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }
        // GET: api/Loais
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CTKMs>>> GetLoais(string key, int offset, int limit = 20, string sortField = "", string sortOrder = "asc")
        {
            var query = _context.CTKMs.Where(s => s.IsDelete==false)
                 .Select(s => new CTKMs
                 {
                     Id = s.Id,
                     Name = s.Name,
                     StartDate = s.StartDate,
                     IsActive = s.IsActive,
                     Image = s.Image,
                     Description = s.Description,
                     DiscountType = s.DiscountType,
                     DiscountValue = s.DiscountValue,
                     EndDate = s.EndDate,
                     UpdateDate = s.UpdateDate,
                     
                 })
            .Where(s => string.IsNullOrEmpty(key) || s.Name.Contains(key));

            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField)
                {
                    case "ten":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.Name) : query.OrderByDescending(s => s.Name);
                        break;
                    default:
                        query = query.OrderBy(s => s.Id);
                        break;
                }
            }
            else
            {
                query = query.OrderBy(s => s.Id);
            }

            query = query.Skip(offset).Take(limit);

            var totalCount = await _context.CTKMs
                .Where(s => s.IsActive == true && s.IsDelete == false)
                .CountAsync();

            var results = await query.ToListAsync();

            return Ok(Result<IEnumerable<CTKMs>>.Success(results, totalCount, ""));
        }
        [HttpGet("GetProductsAvailableForCTKM")]
        public async Task<ActionResult<IEnumerable<SanPham>>> GetProductsAvailableForCTKM(int idLoai, int idCTKM)
        {

            var appliedProductIds = await _context.SanPhamCTKM
         .Where(pc => pc.CTKMId == idCTKM)
         .Select(pc => pc.SanPhamId)
         .Distinct()
         .ToListAsync();

            // Query các sản phẩm thuộc loại, chưa áp dụng CTKM
            var query = _context.SanPhams
                .Where(p => p.IsActive==true && p.IsDelete==false && p.Id_Loai == idLoai);

            if (appliedProductIds.Any())
            {
                query = query.Where(p => !appliedProductIds.Contains(p.Id));
            }

            var totalCount = await query.CountAsync();

            var results = await query

                .ToListAsync();

            return Ok(Result<IEnumerable<SanPham>>.Success(results, totalCount, ""));
        }
        [HttpGet("GetAutoCompleteProduct")]
        public async Task<ActionResult> GetAutoCompleteProduct(int idCTKM,string key, int offset, int limit = 20)
        {
            var appliedProductIds = await _context.SanPhamCTKM
         .Where(pc => pc.CTKMId == idCTKM)
         .Select(pc => pc.SanPhamId)
         .Distinct()
         .ToListAsync();
            var query = _context.SanPhams
                .Where(s => s.IsActive == true && s.IsDelete == false)
                .Select(s => new
                {
                    Id = s.Id,
                    Id_Loai = s.Id_Loai,
                    Ten = s.Ten,
                    GiaBan=s.GiaBan,
                    KhuyenMai=s.KhuyenMai,
                    Image = _context.ImageSanPhams.Where(q => q.IdSanPham == s.Id).Select(q => q.ImageName).FirstOrDefault(),

                })
                .Where(s => string.IsNullOrEmpty(key) || s.Ten.Contains(key));

            if (appliedProductIds.Any())
            {
                query = query.Where(p => !appliedProductIds.Contains(p.Id));
            }
            query = query.OrderBy(s => s.Ten).Skip(offset).Take(limit);

            var totalCount = await query.CountAsync();

            var results = await query.ToListAsync();

            return Ok(Result<object>.Success(results, totalCount, ""));
        }
        [HttpGet("GetSanPhamByIdCTKM")]
        public async Task<ActionResult<IEnumerable<SanPham>>> GetSanPhamByIdCTKM(int id, string key, int offset, int limit = 20, string sortField = "", string sortOrder = "asc")
        {
            var query = _context.SanPhamCTKM
      .Where(p => p.CTKMId == id && p.Status == true)
      .Select(p => p.SanPham)  // Lấy thông tin sản phẩm
      .Where(sp => string.IsNullOrEmpty(key) || sp.Ten.Contains(key));  // Lọc theo từ khóa

            // Xử lý sắp xếp
            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField.ToLower())
                {
                    case "ten":
                        query = sortOrder.ToLower() == "asc"
                            ? query.OrderBy(sp => sp.Ten)
                            : query.OrderByDescending(sp => sp.Ten);
                        break;
                   
                    default:
                        query = query.OrderBy(sp => sp.Id);
                        break;
                }
            }
            else
            {
                query = query.OrderBy(sp => sp.Id);
            }

            // Lấy tổng số bản ghi trước phân trang
            var totalCount = await query.CountAsync();

            // Phân trang
            var results = await query.Skip(offset).Take(limit).ToListAsync();

            // Trả kết quả
            return Ok(Result<IEnumerable<SanPham>>.Success(results, totalCount, ""));
        }
        [HttpGet("TenChuongTrinh")]
        public async Task<ActionResult<IEnumerable<CTKMs>>> GetNameCTKMs()
        {
            var today = DateTime.Now.Date; 

            var ctkms = await _context.CTKMs
                .Where(ctkm => ctkm.StartDate <= today && ctkm.EndDate >= today && ctkm.IsDelete==false)
                .ToListAsync();

            if (ctkms == null || !ctkms.Any())
            {
                return NotFound("Không có chương trình khuyến mãi nào trong hôm nay.");
            }

            return Ok(Result<object>.Success(ctkms));
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<SanPham>> GetCTKM(int id)
        {
            var ctkm = await _context.CTKMs.FirstOrDefaultAsync(sp => sp.Id == id);

            if (ctkm == null)
            {
                return NotFound();
            }

            return Ok(Result<object>.Success(ctkm));
        }
        [HttpPost]
        public async Task<ActionResult<CTKMs>> Post([FromForm] CTKMDto upload)
        {

            CTKMs ctkm;
            if (upload.Id > 0)
            {
                ctkm = await _context.CTKMs.FindAsync(upload.Id);
                ctkm.Name = upload.Name;
                ctkm.Image = upload.Image;
                ctkm.Description = upload.Description;
                ctkm.StartDate = upload.StartDate;
                ctkm.EndDate = upload.EndDate;
                ctkm.DiscountType = upload.DiscountType;
                ctkm.DiscountValue = upload.DiscountValue;
                ctkm.UpdateDate = DateTime.Now;
                //_context.Loais.Update(loai);
                if (upload.files != null)
                {
                    FileHelper.DeleteFileOnTypeAndNameAsync1("banner", ctkm.Image);
                }
            }
            else
            {
                ctkm = new CTKMs()
                {
                    Name = upload.Name,
                    Image = upload.Image,
                    Description = upload.Description,
                    StartDate = upload.StartDate,
                    EndDate = upload.EndDate,
                    DiscountType = upload.DiscountType,
                    DiscountValue = upload.DiscountValue,
                    UpdateDate = DateTime.Now,
                    CreatedDate = DateTime.Now,
                    IsActive = true,
                    IsDelete = false,
                };
                _context.CTKMs.Add(ctkm);
            }
            if (upload.files != null)
            {
                var file = upload.files;

                if (file.Length > 0 && file.Length < 2 * 1024 * 1024)
                {
                    // Kiểm tra xem ảnh đã tồn tại chưa
                    ctkm.Image = await FileHelper.UploadImageAndReturnFileNameAsync5(upload, "", upload.files);

                }

            }
            //Notification notification = new Notification()
            //{
            //    TenSanPham = upload.Name,
            //    TranType = "Add"
            //};
            //_context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            //await _hubContext.Clients.All.BroadcastMessage();
            return Ok(Result<CTKMs>.Success(ctkm));
        }

        [HttpGet("GetCTKMById/{id}")]
        public async Task<ActionResult<IEnumerable<CTKMs>>> GeCTKMById(int id)
        {
            

            var query = _context.CTKMs
                .Where(s => s.IsActive == true && s.IsDelete == false && s.Id == id)
                .Select(s => new CTKMs
                {

                    Name = s.Name,
                    Description= s.Description,
                    DiscountType= s.DiscountType,
                    DiscountValue=s.DiscountValue,
                    StartDate= s.StartDate,
                    EndDate=s.EndDate,
                    Image=s.Image,
                    CreatedDate=s.CreatedDate

                });
            var results = await query.ToListAsync();

            return Ok(Result<IEnumerable<CTKMs>>.Success(results));
        }
        [HttpPost("ThemCTKMSP")]
        public async Task<ActionResult> ThemCTKMSP(int idCTKM, int idSP)
        {
            var now = DateTime.Now;
            var ctkm = await _context.CTKMs.Where(c => c.Id == idCTKM).FirstOrDefaultAsync();
            var query = await _context.SanPhamCTKM
                .Include(x => x.CTKM) 
                .Where(c => c.SanPhamId == idSP)
                .ToListAsync(); 
            var sp = await _context.SanPhams.FindAsync(idSP);
            if (sp == null)
            {
                return Ok(Result<object>.Error("Sản phẩm ko tồn tại"));
            }
            decimal giakm = sp.GiaBan ?? 0;

            if (query.Any())
            {
                foreach (var item in query)
                {

                    if (item.CTKM != null && item.CTKM.IsActive == true)
                    {
                        if (item.CTKM.DiscountType == "1")
                        {
                            giakm -= giakm * (item.CTKM.DiscountValue ?? 0) / 100;
                        }
                        else if (item.CTKM.DiscountType == "2")
                        {
                            giakm -= (item.CTKM.DiscountValue ?? 0);
                        }

                        // Nếu giá bị âm thì lấy giá nhập
                        if (giakm < 0)
                        {
                            giakm = sp.GiaNhap ?? 0;
                            break; // Nếu đã âm rồi thì ngừng tính tiếp
                        }
                    }
                }

                // Sau khi tính xong tất cả CTKM
                //sp.KhuyenMai = giakm;
            }


            var spctkm = new SanPhamCTKM
                {
                    CTKMId = idCTKM,
                    SanPhamId = idSP,
                    Status=true,
                    IsDelete=false,
                    IsActive=true,
                    UpdateDate = DateTime.Now
                };
                _context.SanPhamCTKM.Add(spctkm);

            if (ctkm.DiscountType == "1")
            {
                sp.KhuyenMai = giakm - giakm * ctkm.DiscountValue / 100;

            }
            else if (ctkm.DiscountType == "2")
            {
                sp.KhuyenMai = giakm - ctkm.DiscountValue;

            }

            if (sp.KhuyenMai < 0)
            {
                sp.KhuyenMai = sp.GiaNhap;


            }
            //if (ctkm.StartDate <= now && now  <= ctkm.EndDate)
            //{
            //    if (ctkm.DiscountType == "1")
            //    {
            //        sp.KhuyenMai = giakm - giakm * ctkm.DiscountValue / 100;

            //    }
            //    else if (ctkm.DiscountType == "2")
            //    {
            //        sp.KhuyenMai = giakm - ctkm.DiscountValue;

            //    }

            //    if (sp.KhuyenMai < 0)
            //    {
            //        sp.KhuyenMai = sp.GiaNhap;


            //    }
            //}
            //else
            //{
            //    sp.KhuyenMai = giakm;
            //}
            var shoppingCartItems = await _context.Carts.Where(s => s.SanPhamId == idSP).ToListAsync();

            foreach (var item in shoppingCartItems)
            {
                item.Gia = sp.KhuyenMai;
            }
            await _context.SaveChangesAsync();

            return Ok(Result<object>.Success(sp));
        }
        [HttpPost("UpdateState")]
        public async Task<ActionResult> UpdateState(int id)
        {
            var ctkm = await _context.CTKMs.FirstOrDefaultAsync(s => s.Id == id);
            if (ctkm == null)
            {
                return Ok(Result<object>.Error("CTKM không tồn tại"));
            }

            // Đảo ngược trạng thái IsActive
            ctkm.IsActive = !ctkm.IsActive;
            await _context.SaveChangesAsync();

            // Sau khi đổi trạng thái, cần tính lại giá KhuyenMai cho các sản phẩm liên quan
            var sanPhamIds = await _context.SanPhamCTKM
                .Where(spctkm => spctkm.CTKMId == id)
                .Select(spctkm => spctkm.SanPhamId)
                .Distinct()
                .ToListAsync();

            foreach (var sanPhamId in sanPhamIds)
            {
                await TinhLaiGiaKhuyenMaiChoSanPham(sanPhamId);
            }

            return Ok(Result<object>.Success(ctkm));
        }
        [HttpPost("XoaCTKMSP")]
        public async Task<ActionResult> XoaCTKMSP(int idCTKM, int idSP)
        {
            var sanpham = await _context.SanPhamCTKM.FirstOrDefaultAsync(s => s.CTKMId == idCTKM && s.SanPhamId== idSP);
            _context.Remove(sanpham);
            var sp = await _context.SanPhams.FindAsync(idSP);
            var now = DateTime.Now;
            var ctkm = await _context.CTKMs.Where(c => c.Id == idCTKM).FirstOrDefaultAsync();
            var query = await _context.SanPhamCTKM
                .Include(x => x.CTKM)
                .Where(c => c.SanPhamId == idSP)
                .ToListAsync(); 
            if (sp == null)
            {
                return Ok(Result<object>.Error("Sản phẩm ko tồn tại"));
            }
            decimal giakm = sp.GiaBan ?? 0;

            if (query.Any())
            {
                foreach (var item in query)
                {

                    if (item.CTKMId!=idCTKM && item.CTKM != null  && item.CTKM.IsActive == true)
                    {
                        if (item.CTKM.DiscountType == "1")
                        {
                            giakm -= giakm * (item.CTKM.DiscountValue ?? 0) / 100;
                        }
                        else if (item.CTKM.DiscountType == "2")
                        {
                            giakm -= (item.CTKM.DiscountValue ?? 0);
                        }

                        // Nếu giá bị âm thì lấy giá nhập
                        if (giakm < 0)
                        {
                            giakm = sp.GiaNhap ?? 0;
                            break; // Nếu đã âm rồi thì ngừng tính tiếp
                        }
                    }
                }

                
            }
            // Sau khi tính xong tất cả CTKM
            sp.KhuyenMai = giakm;
            var shoppingCartItems = await _context.Carts.Where(s => s.SanPhamId == idSP).ToListAsync();

            foreach (var item in shoppingCartItems)
            {
                item.Gia = giakm;
            }
            await _context.SaveChangesAsync();
            //await _hubContext.Clients.All.BroadcastMessage();
            return Ok(Result<object>.Success(sanpham));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCTKM(int id)
        {
           
            var ctkm = await _context.CTKMs.FindAsync(id);
            ctkm.IsActive = false;
            ctkm.IsDelete = true;
            ctkm.DeleteDate = DateTime.Now;

            //Notification notification = new Notification()
            //{
            //    TenSanPham = sanPham.Ten,
            //    TranType = "Delete"
            //};
            //_context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.BroadcastMessage();
            return Ok(Result<CTKMs>.Success(ctkm));
        }

        private async Task TinhLaiGiaKhuyenMaiChoSanPham(int sanPhamId)
        {
            var now = DateTime.Now;
            var sp = await _context.SanPhams.FindAsync(sanPhamId);
            if (sp == null) return;

            var dsCTKM = await _context.SanPhamCTKM
                .Include(x => x.CTKM)
                .Where(x => x.SanPhamId == sanPhamId)
                .ToListAsync();

            decimal giaKM = sp.GiaBan ?? 0;

            foreach (var item in dsCTKM)
            {
                if (item.CTKM != null && item.CTKM.IsActive == true)
                {
                    if (item.CTKM.DiscountType == "1")
                    {
                        giaKM -= giaKM * (item.CTKM.DiscountValue ?? 0) / 100;
                    }
                    else if (item.CTKM.DiscountType == "2")
                    {
                        giaKM -= (item.CTKM.DiscountValue ?? 0);
                    }

                    if (giaKM < 0)
                    {
                        giaKM = sp.GiaNhap ?? 0;
                        break;
                    }
                }
            }
            
            

            
            // Sau khi tính xong:
            sp.KhuyenMai = giaKM;
            var shoppingCartItems = await _context.Carts.Where(s => s.SanPhamId == sanPhamId).ToListAsync();

            foreach (var item in shoppingCartItems)
            {
                item.Gia = giaKM;
            }
            await _context.SaveChangesAsync();
        }

    }
}
