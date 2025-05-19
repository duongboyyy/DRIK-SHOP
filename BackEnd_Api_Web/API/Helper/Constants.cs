using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace API.Helpers
{
    public static class Constants
    {
        public static class Strings
        {
            public static class JwtClaimIdentifiers
            {
                public const string Rol = "rol", Id = "id";
            }
            public static class JwtClaims
            {
                public const string ApiAccess = "api_access";
            }
        }
    }
    public static class BannerType
    {
        public static int BannerTop = 1;
        public static int BannerBottom = 2;
        public static int BannerLeft = 3;
        public static int BannerRight = 4;
        public static int BannerFlashSale = 5;
    }

    public static class PaymentType
    {
        public static int COD = 1;
        public static int Vnpay = 2;
        public static int Momo = 3;
        public static int Paypal = 4;
    }
    
    public static class StateMentPayed
    {
        public static int ChuaThanhToan = 0;
        public static int DaThanhToan = 1;
        public static int ChoThanhToan = 2;
    }

    public static class Statement
    {
        public static int ChoXacNhan = 0;
        public static int DaXacNhan = 1;
        public static int HoanThanh = 2;
        public static int Huy = 3;
        public static int GiaoHang = 4;
        public static int ChoThanhToan = 5;
        public static int YeuCauHoanHang = 6;
        public static int HoanHangDaXacNhan = 7;
        public static int HoanHangTatCa = 8;
        public static int HoanHangHuy = 9;
        public static int HoanHangMotPhan = 10;
        public static int HoanHangThanhCong = 11;
    }

    //  public int TrangThai { get; set; } // 0: Chờ xử lý, 1: Đã xác nhận, 2: Đã hoàn tất
    public static class TrangThaiHoanHang
    {
        public static int ChoXuLy = 1;
        public static int DaXacNhan = 2;
        public static int HoanTat = 3;
        public static int Huy = 4;
    }

    // Loại đơn hàng // ofline hay online và có phải của 1 shop ko
    public static class LoaiDon
    {
        public static int DonOffline = 1;
        public static int DonOnline = 2;
    }

    public static class LoaiPhieuNhap
    {
        public static int NhapVeTuNCC = 1;
        public static int ChuyenKho = 2;
    }

}
