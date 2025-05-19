using Microsoft.AspNetCore.Http;
using System;

namespace API.Dtos
{
    public class CTKMDto
    {
        public int Id {  get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string DiscountType { get; set; }
        public decimal? DiscountValue { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeleteDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDelete { get; set; }
        public IFormFile files { get; set; }
    }
}
