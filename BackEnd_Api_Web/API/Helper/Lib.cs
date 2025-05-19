using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Helper
{
    public static class Lib
    {
        public static string GenerateOTP()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public static async Task<(double Lat, double Lng)?> GetLatLngFromAddressAsync(string address)
        {
            using var httpClient = new HttpClient();
            var encodedAddress = Uri.EscapeDataString(address);
            var requestUrl = $"https://nominatim.openstreetmap.org/search?format=json&q={encodedAddress}";

            try
            {
                // Thêm User-Agent để tuân thủ chính sách của Nominatim
                httpClient.DefaultRequestHeaders.Add("User-Agent", "YourAppName");

                var response = await httpClient.GetStringAsync(requestUrl);
                var jsonDocument = JsonDocument.Parse(response);

                if (jsonDocument.RootElement.GetArrayLength() > 0)
                {
                    var location = jsonDocument.RootElement[0];
                    var lat = double.Parse(location.GetProperty("lat").GetString());
                    var lng = double.Parse(location.GetProperty("lon").GetString());


                    return (lat, lng);
                }
                else
                {
                    Console.WriteLine("Không tìm thấy tọa độ.");
                    return (10,105);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi gọi API: {ex.Message}");
                return null;
            }
        }

        // Hàm tính khoảng cách giữa hai điểm dựa trên tọa độ lat/lng
        public static double GetDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371;
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }


    }
}
