using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace API.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Image { get; set; }
        public string Link { get; set; }
        public int Type { get; set; }
        public string SendTo { get; set; }
        public bool IsSent { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedUserId { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? SentUserId { get; set; }
        public DateTime? SentDate { get; set; }
        public int? DeletedUserId { get; set; }
        public DateTime? DeletedDate { get; set; }

        // Các field custom bạn có thể dùng thêm nếu muốn
        public string TenSanPham { get; set; }
        public string TranType { get; set; }
    }

}
