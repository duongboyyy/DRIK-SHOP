using Microsoft.AspNetCore.StaticFiles;
using System;
using System.Linq;
namespace API.Helper
{
    public static class StringHelper
    {
        public static string RandomString(int length)
        {
            Random random = new Random();
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static int XuLyIdSPBT(string s)
        {
            string[] arrListStr = s.Split(" ");
            return int.Parse(arrListStr[1]);
        }

        public static int XuLyIdSPBTMa(string s)
        {
            if (string.IsNullOrEmpty(s))
                return 0;

            // Tách chuỗi bằng dấu "," và tìm phần có chứa "Mã:"
            string[] parts = s.Split(',');
            string maPart = parts.FirstOrDefault(p => p.Contains("Mã:"));

            if (string.IsNullOrEmpty(maPart))
                return 0;

            // Lấy số sau "Mã:"
            string[] maSplit = maPart.Split(':');
            if (maSplit.Length < 2)
                return 0;

            if (int.TryParse(maSplit[1].Trim(), out int id))
            {
                return id;
            }

            return 0;
        }

    }
}
