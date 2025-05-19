using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.Helpers;
using API.Models;
using API.Dtos;
using API.Helper.Factory;
using Microsoft.AspNetCore.Authorization;
using API.Helper.Result;
namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtFactory _jwtFactory;
        private readonly JsonSerializerSettings _serializerSettings;
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly DPContext _context;
        private readonly IMapper _mapper;
        public AuthController(UserManager<AppUser> userManager, IMapper mapper, DPContext context, IJwtFactory jwtFactory, IOptions<JwtIssuerOptions> jwtOptions)
        {
            _userManager = userManager;
            _jwtFactory = jwtFactory;
            _jwtOptions = jwtOptions.Value;
            _mapper = mapper;
            _context = context;
            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }
        static string id;
        [HttpPost("registerCustomer")]
        public async Task<IActionResult> Post([FromBody] JObject json)
        {
            var model = JsonConvert.DeserializeObject<RegistrationViewModel>(json.GetValue("data").ToString());
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingUser = await _context.AppUsers.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
            {
                // Email đã tồn tại
                return Conflict(new { Message = "Email đã tồn tại." });
            }
            model.Quyen = "Customer";
            var userIdentity = _mapper.Map<AppUser>(model);
            var result = await _userManager.CreateAsync(userIdentity, model.Password);
            AppUser user = new AppUser();
            user = await _context.AppUsers.FirstOrDefaultAsync(s => s.Id == userIdentity.Id);
            _context.AppUsers.Update(user);
            if (!result.Succeeded) return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));
            await _context.JobSeekers.AddAsync(new JobSeeker { Id_Identity = userIdentity.Id, Location = model.Location });
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassword model)
        {
            if (model.NewPass != model.ConfirmPass)
                return Ok(Result<object>.Success(null, 0, "password ko hop le"));

            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user == null)
                return Ok(Result<object>.Success(null, 0, "khong ton tai user!!!"));

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var resetPassResult = await _userManager.ResetPasswordAsync(user, token, model.NewPass);

            return Ok(Result<object>.Success(null, 0, "cap nhat mat khau thanh cong!!!"));
        }
        [HttpPost("getDiaChi")]
        public async Task<IActionResult> GetDiaChi([FromBody] JObject json)
        {
            var id = json.GetValue("id_user").ToString();
            var resuft = await _context.AppUsers.Where(d => d.Id == id).Select(d => d.DiaChiFull).SingleOrDefaultAsync();
            return Json(resuft);
        }
        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Post([FromBody] CredentialsViewModel credentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var identity = await GetClaimsIdentity(credentials.UserName, credentials.Password);
            if (identity == null)
            {
                return BadRequest(Errors.AddErrorToModelState("login_failure", "Invalid username or password.", ModelState));
            }

            var userId = identity.Claims.Single(c => c.Type == "id").Value;
            var user = _context.AppUsers
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.Quyen,
                    u.ImagePath,
                    u.Id_CuaHang,
                    u.LoaiAccount,
                    FullName = u.FirstName + " " + u.LastName,
                    u.Email
                })
                .FirstOrDefault();

            if (user == null)
            {
                return BadRequest("User not found");
            }

            
            var roles = _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => new
                {
                    RoleId = ur.RoleId,
                    RoleName = _context.Roles
                        .Where(r => r.Id == ur.RoleId)
                        .Select(r => r.Name)
                        .FirstOrDefault(),
                    Claims = _context.RoleClaims
                        .Where(rc => rc.RoleId == ur.RoleId)
                        .Select(rc => new
                        {   
                            rc.ClaimType,
                            rc.ClaimValue
                        })
                        .ToList()
                })
                .ToList();

            // Thêm quyền vào claims để nhúng vào JWT token
            var claims = identity.Claims.ToList();

            // Thêm danh sách Role của user vào claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.RoleName));
            }

            // Thêm danh sách Claim của từng Role vào claims
            foreach (var role in roles)
            {
                foreach (var claim in role.Claims)
                {
                    claims.Add(new Claim(claim.ClaimType, claim.ClaimValue));
                }
            }

            // Tạo token với danh sách claims đã cập nhật
            var auth_token = await _jwtFactory.GenerateEncodedToken(credentials.UserName, new ClaimsIdentity(claims));

            var response = new
            {
                id = user.Id,
                quyen = user.Quyen,
                hinh = user.ImagePath,
                fullname = user.FullName,
                email = user.Email,
                id_cuahang = user.Id_CuaHang,
                loaiAccount = user.LoaiAccount,
                roles,  // Trả về danh sách Role và Claim của Role
                auth_token,
                expires_in = (int)_jwtOptions.ValidFor.TotalSeconds
            };

            var json = JsonConvert.SerializeObject(response, _serializerSettings);
            return new OkObjectResult(json);
        }


        [HttpPost("logout")]
        [HttpGet]
        public IActionResult logout()
        {
            id = null;
            return Ok();
        }
        [HttpPost]
        public async Task<IActionResult> UpdateUser([FromBody] CredentialsViewModel credentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var identity = await GetClaimsIdentity(credentials.UserName, credentials.Password);
            if (identity == null)
            {
                return BadRequest(Errors.AddErrorToModelState("login_failure", "Invalid username or password.", ModelState));
            }
            var response = new
            {
                id = identity.Claims.Single(c => c.Type == "id").Value,
                quyen = _context.AppUsers.FirstOrDefault(s => s.Id == id).Quyen,
                email = _context.AppUsers.FirstOrDefault(s => s.Id == id).Email,
                id_cuahang = _context.AppUsers.FirstOrDefault(s => s.Id == id).Id_CuaHang,
                loaiAccount = _context.AppUsers.FirstOrDefault(s=>s.Id==id).LoaiAccount,
                auth_token = await _jwtFactory.GenerateEncodedToken(credentials.UserName, identity),
                expires_in = (int)_jwtOptions.ValidFor.TotalSeconds
            };
            var json = JsonConvert.SerializeObject(response, _serializerSettings);
            return new OkObjectResult(json);
        }
        private async Task<ClaimsIdentity> GetClaimsIdentity(string userName, string password)
        {
            if (!string.IsNullOrEmpty(userName) && !string.IsNullOrEmpty(password))
            {
                // get the user to verifty
                var userToVerify = await _userManager.FindByNameAsync(userName);
                if (userToVerify != null)
                {
                    // check the credentials  
                    if (await _userManager.CheckPasswordAsync(userToVerify, password))
                    {
                        AuthHistory auth = new AuthHistory();
                        auth.IdentityId = userToVerify.Id;
                        auth.Datetime = DateTime.Now;
                        _context.AuthHistories.Add(auth);
                        await _context.SaveChangesAsync();
                        id = userToVerify.Id;
                        return await Task.FromResult(_jwtFactory.GenerateClaimsIdentity(userName, userToVerify.Id));
                    }
                }
            }
            return await Task.FromResult<ClaimsIdentity>(null);
        }

        [HttpPost("AuthHistory")]
        public async Task<ActionResult<AppUser>> SuaThongTin([FromBody] ChangeInmomation model) 
        {
            //var model = JsonConvert.DeserializeObject<RegistrationViewModel>(json.GetValue("data").ToString());
            AppUser appUser = new AppUser();
            appUser = await _context.AppUsers.FindAsync(model.IdUser);
            appUser.FirstName = model.FirstName;
            appUser.LastName = model.LastName;
            appUser.SDT = model.SDT;
            appUser.Tinh = model.Tinh;
            appUser.Huyen = model.Huyen;
            appUser.Xa = model.Xa;
            appUser.DiaChi = model.DiaChi;
            appUser.DiaChiFull = $"{model.DiaChi}, {model.Xa}, {model.Huyen}, {model.Tinh}";
            await _context.SaveChangesAsync();
            return Ok(Result<object>.Success(appUser, 1, "Cập nhật thành công !!!"));
        }

        [HttpGet("AuthHistory/{iduser}")]
        public async Task<ActionResult<AppUser>> GetAuthHistory(string iduser)
        {
            AppUser appUser = new AppUser();
            appUser = await _context.AppUsers.FindAsync(iduser);
            return appUser;
        }
        
    }
}