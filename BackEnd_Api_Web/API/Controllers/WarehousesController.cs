using API.Data;
using API.Dtos;
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
    public class WarehousesController : ControllerBase
    {
        private readonly DPContext _Db;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        public WarehousesController(DPContext context, IHubContext<BroadcastHub, IHubClient> hubContext)
        {
            _Db = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> Gets(string key, int offset, int limit = 20, string sortField = "", string sortOrder = "asc")
        {
            var query = _Db.Kho
                .Where(s => s.IsActive == true && s.IsDelete == false)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.DiaChi,
                    s.CreatedDate,
                    s.UpdatedDate,
                    s.DeletedDate,
                    s.IsActive,
                    s.Tinh,
                    s.Huyen,
                    s.Xa,
                    s.IdCuaHang
                })
                .Where(s => string.IsNullOrEmpty(key) || s.Name.Contains(key) || s.DiaChi.Contains(key));

            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField.ToLower())
                {
                    case "name":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.Name) : query.OrderByDescending(s => s.Name);
                        break;
                    case "diachi":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.DiaChi) : query.OrderByDescending(s => s.DiaChi);
                        break;
                    case "createddate":
                        query = sortOrder == "asc" ? query.OrderBy(s => s.CreatedDate) : query.OrderByDescending(s => s.CreatedDate);
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

            var totalCount = await query.CountAsync();
            var results = await query.Skip(offset).Take(limit).ToListAsync();

            return Ok(Result<IEnumerable<object>>.Success(results, totalCount, ""));
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromForm] UploadKho form)
        {
            Kho obj;
            if (form.Id > 0)
            {
                obj = await _Db.Kho.FindAsync(form.Id);
                obj.Name = form.Name;
                obj.DiaChi = form.Address;
                obj.UpdatedDate = DateTime.Now;
                obj.Tinh=form.Tinh;
                obj.Huyen = form.Huyen;
                obj.Xa=form.Xa;
                obj.IsActive = form.IsActive;
            }
            else
            {
                obj = new Kho()
                {
                    Name = form.Name,
                    DiaChi = form.Address,
                    CreatedDate = DateTime.Now,
                    IsActive = true,
                    IsDelete = false,
                    Tinh = form.Tinh,
                    Huyen = form.Huyen,
                    Xa = form.Xa,
                };
                _Db.Kho.Add(obj);
            }
            await _Db.SaveChangesAsync();
            return Ok(Result<Kho>.Success(obj, 1,"update success"));
        }
        [HttpGet("GetWareHouseById/{id}")]
        public async Task<ActionResult<IEnumerable<Kho>>> GetWareHouseById(int id)
        {
            var query = _Db.Kho
                .Where(s => s.IsActive == true && s.IsDelete == false && s.Id == id)
                .Select(s => new Kho
                {
                    Id=s.Id,
                    Name = s.Name,
                    DiaChi=s.DiaChi,
                    Tinh=s.Tinh,
                    Huyen=s.Huyen,
                    Xa=s.Xa,
                    IsActive=s.IsActive,
                    CreatedDate = s.CreatedDate

                });
            var results = await query.ToListAsync();

            return Ok(Result<IEnumerable<Kho>>.Success(results));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var obj = await _Db.Kho.FindAsync(id);
            obj.IsActive = false;
            obj.IsDelete = true;
            obj.DeletedDate = DateTime.Now;
            await _Db.SaveChangesAsync();
            return Ok(Result<object>.Success(obj));
        }
    }
 }
