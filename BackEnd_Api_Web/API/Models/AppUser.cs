using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class AppUser : IdentityUser
    {
        public string DiaChi { get;set; }
        public string DiaChiFull { get; set; }
        public string SDT { get; set; }
        public string ImagePath { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Quyen { get; set; }
        public string Tinh { get; set; }
        public string Huyen { get; set; }
        public string Xa { get; set; }
        public double Point { get; set; } // điểm tích luỹ
        public int? LoaiAccount { get; set; } // 1: user, 2: admin // cửa hàng
        public int? Id_CuaHang { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        [NotMapped]
        public string PasswordResetToken { get; set; }
        [NotMapped]
        public DateTime? PasswordResetTokenExpires { get; set; }
        public virtual ICollection<UserLike> UserLikes { get; set; }
        public virtual ICollection<UserComment> UserComments { get; set; }
        public virtual ICollection<PhieuNhapHang> PhieuNhapHangs { get; set; }
        public virtual ICollection<UserChat> UserChats { get; set; }
        public virtual ICollection<Calendar> Calendars { get; set; }
    }
}
