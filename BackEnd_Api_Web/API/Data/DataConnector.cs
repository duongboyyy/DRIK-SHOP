using API.Dtos;
using API.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace API.Data
{
    public interface IDataConnector
    {
        Task<List<TenSPSoLanXuatHienTrongDonHang>> GetSoLanXuatHienTrongDonHang(DateTime fromDate, DateTime toDate);
        Task<List<TenSanPhamDoanhSo>> Top10SanPhamLoiNhats(DateTime fromDate, DateTime toDate);
        Task<List<SanPhamTonKho>>Top10SanPhamTonNhats();
        Task<List<NhanHieuBanChayNhatTrongNam>> GetNhanHieuBanChayNhatTrongNam();
        Task<List<DataSetBanRaTonKho>> DataDataSetBanRaTonKho();
        Task<List<NhaCungCapSoLuong>> GetNhaCungCapSoLuongs(DateTime? fromDate, DateTime? toDate);
        Task<List<NhaCungCapTongTien>> GetDoanhSoBans(DateTime? fromDate, DateTime? toDate);
        Task<NamSoTongTien> GetTongTienTheoNgay(DateTime fromDate, DateTime toDate);
        Task<MotHoaDon> HoaDonDetailAsync(int id);
        Task<MotHoaDon> GetOneOrder(int id);
    }
    /// <summary>
    /// this is class has some custom data connect
    /// </summary>
    public class DataConnector: IDataConnector
    {
        private readonly DPContext _context;
        public DataConnector(DPContext context)
        {
            _context = context;
        }
        public async Task<List<TenSPSoLanXuatHienTrongDonHang>> GetSoLanXuatHienTrongDonHang(DateTime fromDate, DateTime toDate)
        {
            var sql = @"
                SELECT TOP(10)
                    SanPhams.Ten + ' ' + Sizes.TenSize + ' ' + MauSacs.MaMau AS TenSP,
                    SUM(ChiTietHoaDons.SoLuong) AS SoLanXuatHien
                FROM SanPhams
                INNER JOIN SanPhamBienThes
                    ON SanPhams.Id = SanPhamBienThes.Id_SanPham
                INNER JOIN MauSacs
                    ON SanPhamBienThes.Id_Mau = MauSacs.Id
                INNER JOIN Sizes
                    ON SanPhamBienThes.SizeId = Sizes.Id
                INNER JOIN ChiTietHoaDons
                    ON ChiTietHoaDons.Id_SanPhamBienThe = SanPhamBienThes.Id
                INNER JOIN HoaDons
                    ON ChiTietHoaDons.Id_HoaDon = HoaDons.Id
                WHERE (HoaDons.TrangThai = 2 OR HoaDons.TrangThai = 8 OR HoaDons.TrangThai = 10)
                  AND HoaDons.IsPayed = 1
                  AND HoaDons.NgayTao BETWEEN @FromDate AND @ToDate
                GROUP BY SanPhams.Ten + ' ' + Sizes.TenSize + ' ' + MauSacs.MaMau
                ORDER BY SUM(ChiTietHoaDons.SoLuong) DESC;
            ";

            var list = new List<TenSPSoLanXuatHienTrongDonHang>();
            using var conn = new SqlConnection(_context.Database.GetConnectionString());
            await conn.OpenAsync();

            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@FromDate", fromDate);
            cmd.Parameters.AddWithValue("@ToDate", toDate);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new TenSPSoLanXuatHienTrongDonHang
                {
                    TenSP = reader.GetString(reader.GetOrdinal("TenSP")),
                    SoLanXuatHienTrongDonHang = reader.GetInt32(reader.GetOrdinal("SoLanXuatHien"))
                });
            }

            return list;
        }

        public async Task<List<SanPhamTonKho>> Top10SanPhamTonNhats()
        {
            var sql = @"select top(10) SanPhams.Ten+' '+Sizes.TenSize+' '+MauSacs.MaMau as 'Ten',SanPhamBienThes.SoLuongTon
                        from SanPhams
                        inner join SanPhamBienThes
                        on SanPhams.Id = SanPhamBienThes.Id_SanPham
                        inner join MauSacs
                        on SanPhamBienThes.Id_Mau = MauSacs.Id
                        inner join Sizes
                        on SanPhamBienThes.SizeId = Sizes.Id
                        order by SanPhamBienThes.SoLuongTon desc
                       ";
            var soluongton = new List<SanPhamTonKho>();
            SqlConnection conn = new SqlConnection(_context.Database.GetConnectionString());
            await conn.OpenAsync();
            SqlCommand cmd = new SqlCommand(sql, conn);
            SqlDataReader reader;
            reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    soluongton.Add(new SanPhamTonKho()
                    {
                        Ten = (string)reader["Ten"],
                        SoLuongTon = (int)reader["SoLuongTon"],
                    });
                }
            }
            await conn.CloseAsync();
            return soluongton.ToList();
        }
        public async Task<List<TenSanPhamDoanhSo>> Top10SanPhamLoiNhats(DateTime fromDate, DateTime toDate)
        {
            string sql = @"
                            SELECT TOP(10) 
                                SanPhams.Ten + ' ' + Sizes.TenSize + ' ' + MauSacs.MaMau AS Ten, 
                                CAST(SUM(ChiTietHoaDons.ThanhTien) AS DECIMAL(18, 2)) AS ThanhTien
                            FROM SanPhams
                            INNER JOIN SanPhamBienThes ON SanPhams.Id = SanPhamBienThes.Id_SanPham
                            INNER JOIN MauSacs ON SanPhamBienThes.Id_Mau = MauSacs.Id
                            INNER JOIN Sizes ON SanPhamBienThes.SizeId = Sizes.Id
                            INNER JOIN ChiTietHoaDons ON SanPhamBienThes.Id = ChiTietHoaDons.Id_SanPhamBienThe
                            INNER JOIN HoaDons ON ChiTietHoaDons.Id_HoaDon = HoaDons.Id
                            WHERE (HoaDons.TrangThai = 2 OR HoaDons.TrangThai = 8 OR HoaDons.TrangThai = 10)
                              AND HoaDons.IsPayed = 1
                              AND HoaDons.NgayTao BETWEEN @FromDate AND @ToDate
                            GROUP BY SanPhams.Ten, Sizes.TenSize, MauSacs.MaMau
                            ORDER BY CAST(SUM(ChiTietHoaDons.ThanhTien) AS DECIMAL(18, 2)) DESC;
                        ";
            SqlConnection conn = new SqlConnection(_context.Database.GetConnectionString());
            List<TenSanPhamDoanhSo> tenspdss = new List<TenSanPhamDoanhSo>();
            await conn.OpenAsync();
            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@FromDate", fromDate);
            cmd.Parameters.AddWithValue("@ToDate", toDate);

            SqlDataReader reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    tenspdss.Add(
                        new TenSanPhamDoanhSo()
                        {
                            TenSP = (string)reader["Ten"],
                            DoanhSoCaoNhat = (decimal)reader["ThanhTien"]
                        });
                }
            }
            return tenspdss;
        }
        public async Task<List<NhanHieuBanChayNhatTrongNam>> GetNhanHieuBanChayNhatTrongNam()
        {
            string sql = @"select top(5) NhanHieus.Ten, sum(ChiTietHoaDons.Soluong) as 'soluong'
                                from NhanHieus
                                inner join SanPhams
                                    on NhanHieus.Id = SanPhams.Id_NhanHieu
                                inner join SanPhamBienThes
                                    on SanPhamBienThes.Id_SanPham = SanPhams.Id
                                inner join ChiTietHoaDons 
                                    on ChiTietHoaDons.Id_SanPhamBienThe = SanPhamBienThes.Id
                                inner join HoaDons
                                    on HoaDons.Id = ChiTietHoaDons.Id_HoaDon
                                where DATEPART(YYYY, HoaDons.NgayTao) = YEAR(GETDATE()) and HoaDons.TrangThai = 2
                                group by NhanHieus.Ten
                        ";
            SqlConnection cnn;
            cnn = new SqlConnection(_context.Database.GetConnectionString());
            SqlDataReader reader;
            SqlCommand cmd;
            List<NhanHieuBanChayNhatTrongNam> listNH = new List<NhanHieuBanChayNhatTrongNam>();
            await cnn.OpenAsync();
            cmd = new SqlCommand(sql, cnn);
            reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    listNH.Add(new NhanHieuBanChayNhatTrongNam()
                    {
                        Ten = (string)reader["Ten"],
                        SoLuong = (int)reader["soluong"]
                    });
                }
            }
            cnn.Close();
            return listNH;
        }
        public async Task<List<NhanHieuBanChayNhatTrongNam>> GetNhanHieuBanChayNhat(int? year = null)
        {
            // Lấy năm hiện tại nếu không truyền tham số year
            int selectedYear = year ?? DateTime.Now.Year;

            string sql = @"
                select top(10) NhanHieus.Ten, sum(ChiTietHoaDons.Soluong) as 'soluong'
                from NhanHieus
                inner join SanPhams on NhanHieus.Id = SanPhams.Id_NhanHieu
                inner join SanPhamBienThes on SanPhamBienThes.Id_SanPham = SanPhams.Id
                inner join ChiTietHoaDons on ChiTietHoaDons.Id_SanPhamBienThe = SanPhamBienThes.Id
                inner join HoaDons on HoaDons.Id = ChiTietHoaDons.Id_HoaDon
                where DATEPART(YYYY, HoaDons.NgayTao) = @Year and HoaDons.TrangThai = 2
                group by NhanHieus.Ten
            ";

            using SqlConnection cnn = new SqlConnection(_context.Database.GetConnectionString());
            using SqlCommand cmd = new SqlCommand(sql, cnn);

            // Truyền tham số năm vào câu lệnh SQL
            cmd.Parameters.AddWithValue("@Year", selectedYear);

            List<NhanHieuBanChayNhatTrongNam> listNH = new List<NhanHieuBanChayNhatTrongNam>();
            await cnn.OpenAsync();
            using SqlDataReader reader = await cmd.ExecuteReaderAsync();

            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    listNH.Add(new NhanHieuBanChayNhatTrongNam()
                    {
                        Ten = reader["Ten"].ToString(),
                        SoLuong = Convert.ToInt32(reader["soluong"])
                    });
                }
            }

            return listNH;
        }

        public async Task<List<DataSetBanRaTonKho>> DataDataSetBanRaTonKho()
        {
            string sql = @"
                        select top(16) SanPhams.Ten+' '+ChiTietHoaDons.Mau+' '+ChiTietHoaDons.Size as 'Ten',cast(sum(SanPhams.GiaNhap*SanPhamBienThes.SoLuongTon) as decimal(18,2)) as'GiaTriTonKho' ,sum(ChiTietHoaDons.ThanhTien) as'GiaTriBanRa'
                        from ChiTietHoaDons
                        inner join SanPhamBienThes
                        on ChiTietHoaDons.Id_SanPhamBienThe = SanPhamBienThes.Id
                        inner join SanPhams
                        on ChiTietHoaDons.Id_SanPham = SanPhams.Id
                        inner join HoaDons
                        on ChiTietHoaDons.Id_HoaDon = HoaDons.Id
                        where HoaDons.TrangThai = 2
                        group by(SanPhams.Ten+' '+ChiTietHoaDons.Mau+' '+ChiTietHoaDons.Size)
                        order by sum(ChiTietHoaDons.ThanhTien) desc;
                        ";
            SqlConnection cnn;
            cnn = new SqlConnection(_context.Database.GetConnectionString());
            SqlDataReader reader;
            SqlCommand cmd;
            var list = new List<DataSetBanRaTonKho>();
            await cnn.OpenAsync();
            cmd = new SqlCommand(sql, cnn);
            reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    list.Add(new DataSetBanRaTonKho()
                    {
                        Ten = (string)reader["Ten"],
                        GiaTriTonKho = (decimal)reader["GiaTriTonKho"],
                        GiaTriBanRa = (decimal)reader["GiaTriBanRa"]
                    });
                }
            }
            await cnn.CloseAsync();
            return list;
        }
        public async Task<List<NhaCungCapSoLuong>> GetNhaCungCapSoLuongs(DateTime? fromDate, DateTime? toDate)
        {
            var sql = new StringBuilder();
            sql.Append(@"
                        SELECT NhaCungCaps.Ten, 
                               SUM(ChiTietPhieuNhapHangs.SoLuongNhap) AS SoLuongDaNhap
                        FROM ChiTietPhieuNhapHangs
                        INNER JOIN SanPhamBienThes ON SanPhamBienThes.Id = ChiTietPhieuNhapHangs.Id_SanPhamBienThe
                        INNER JOIN SanPhams ON SanPhams.Id = SanPhamBienThes.Id_SanPham
                        INNER JOIN NhaCungCaps ON NhaCungCaps.Id = SanPhams.Id_NhaCungCap
                        INNER JOIN PhieuNhapHangs ON PhieuNhapHangs.Id = ChiTietPhieuNhapHangs.Id_PhieuNhapHang
                        WHERE 1=1
                    ");

                        if (fromDate.HasValue)
                            sql.Append(" AND PhieuNhapHangs.NgayTao >= @FromDate");

                        if (toDate.HasValue)
                            sql.Append(" AND PhieuNhapHangs.NgayTao <= @ToDate");

                        sql.Append(@"
                    GROUP BY NhaCungCaps.Ten
                    ORDER BY SoLuongDaNhap DESC
                ");

            using var cnn = new SqlConnection(_context.Database.GetConnectionString());
            var list = new List<NhaCungCapSoLuong>();
            await cnn.OpenAsync();

            var cmd = new SqlCommand(sql.ToString(), cnn);

            if (fromDate.HasValue)
                cmd.Parameters.AddWithValue("@FromDate", fromDate.Value);

            if (toDate.HasValue)
                cmd.Parameters.AddWithValue("@ToDate", toDate.Value);

            var reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    list.Add(new NhaCungCapSoLuong()
                    {
                        Ten = (string)reader["Ten"],
                        SoLuong = (int)reader["SoLuongDaNhap"]
                    });
                }
            }
            await cnn.CloseAsync();
            return list;
        }



        public async Task<List<NhaCungCapTongTien>> GetDoanhSoBans(DateTime? fromDate, DateTime? toDate)
        {
            var sql = new StringBuilder();
                            sql.Append(@"
                        SELECT NhaCungCaps.Ten,
                               SUM(PhieuNhapHangs.TongTien) AS TongTien,
                               COUNT(DISTINCT PhieuNhapHangs.Id) AS SoDonHang
                        FROM ChiTietPhieuNhapHangs
                        JOIN SanPhamBienThes ON SanPhamBienThes.Id = ChiTietPhieuNhapHangs.Id_SanPhamBienThe
                        JOIN SanPhams ON SanPhams.Id = SanPhamBienThes.Id_SanPham
                        JOIN NhaCungCaps ON NhaCungCaps.Id = SanPhams.Id_NhaCungCap
                        JOIN PhieuNhapHangs ON PhieuNhapHangs.Id = ChiTietPhieuNhapHangs.Id_PhieuNhapHang
                        WHERE 1=1
                    ");

                            if (fromDate.HasValue)
                                sql.Append(" AND PhieuNhapHangs.NgayTao >= @FromDate");

                            if (toDate.HasValue)
                                sql.Append(" AND PhieuNhapHangs.NgayTao <= @ToDate");

                            sql.Append(@"
                        GROUP BY NhaCungCaps.Ten
                        ORDER BY SUM(PhieuNhapHangs.TongTien) DESC
                    ");

            var list = new List<NhaCungCapTongTien>();
            using (var cnn = new SqlConnection(_context.Database.GetConnectionString()))
            {
                await cnn.OpenAsync();
                using (var cmd = new SqlCommand(sql.ToString(), cnn))
                {
                    if (fromDate.HasValue)
                        cmd.Parameters.AddWithValue("@FromDate", fromDate.Value);

                    if (toDate.HasValue)
                        cmd.Parameters.AddWithValue("@ToDate", toDate.Value);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            while (await reader.ReadAsync())
                            {
                                list.Add(new NhaCungCapTongTien
                                {
                                    Ten = (string)reader["Ten"],
                                    TongTien = (decimal)reader["TongTien"],
                                    SoDonHang = (int)reader["SoDonHang"]
                                });
                            }
                        }
                    }
                }
            }
            return list;
        }



        public async Task<NamSoTongTien> GetTongTienTheoNgay(DateTime fromDate, DateTime toDate)
        {
            // 1. Đơn hoàn thành hoặc đã thanh toán
            var tongThuTuDonBan = await _context.HoaDons
                .Where(hd =>
                    hd.NgayTao >= fromDate &&
                    hd.NgayTao <= toDate &&
                    (hd.TrangThai == 2 && hd.IsPayed == true)
                )
                .SumAsync(hd => (decimal?)hd.TongTien) ?? 0;

            // 2. Đơn hoàn hàng (trạng thái 8, 10)
            var donHoan = await _context.HoaDons
                .Where(hd =>
                    hd.NgayTao >= fromDate &&
                    hd.NgayTao <= toDate &&
                    (hd.TrangThai == 8 || hd.TrangThai == 10)
                )
                .ToListAsync();

            decimal tongThuTuDonHoan = 0;

            foreach (var hd in donHoan)
            {
                decimal tongTienDonHoan = hd.TongTien;

                var tongTienDonCon = await _context.HoaDons
                    .Where(x => x.IdParent == hd.Id && x.NgayTao >= fromDate && x.NgayTao <= toDate)
                    .SumAsync(x => (decimal?)x.TongTien) ?? 0;

                tongThuTuDonHoan += tongTienDonHoan - tongTienDonCon;
            }

            var result = new NamSoTongTien
            {
                Nam = fromDate.Year, // hoặc null nếu bạn muốn bỏ
                TongTien = tongThuTuDonBan + tongThuTuDonHoan
            };

            return result;
        }


        public async Task<NamSoTongTien> GetTongTienTheoNam(int? year = null)
        {
            // Lấy năm hiện tại nếu không truyền tham số
            int selectedYear = year ?? DateTime.Now.Year;

            string sql = @"
        select DATEPART(YYYY, HoaDons.NgayTao) as 'Nam', 
               sum(HoaDons.TongTien) as 'TongTienTrongNam'
        from HoaDons
        where DATEPART(YYYY, HoaDons.NgayTao) = @Year 
              and HoaDons.TrangThai = 2 and HoaDon.IsPayed = 1
        group by DATEPART(YYYY, HoaDons.NgayTao)
    ";

            using SqlConnection cnn = new SqlConnection(_context.Database.GetConnectionString());
            using SqlCommand cmd = new SqlCommand(sql, cnn);

            // Truyền tham số năm vào câu lệnh SQL
            cmd.Parameters.AddWithValue("@Year", selectedYear);

            var result = new NamSoTongTien();
            await cnn.OpenAsync();

            using SqlDataReader reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    result.Nam = (int)reader["Nam"];
                    result.TongTien = (decimal)reader["TongTienTrongNam"];
                }
            }

            return result;
        }

        public async Task<MotHoaDon> HoaDonDetailAsync(int id)
        {
            string sql = @"		;with ProductImageTable
	                            as (
		                        SELECT ChiTietHoaDons.Id,SanPhams.Ten,ImageSanPhams.ImageName,Sizes.TenSize,MauSacs.MaMau,ChiTietHoaDons.Soluong,cast(SanPhams.GiaBan as decimal(18,2)) as'GiaBan',cast(ChiTietHoaDons.GiaBan as decimal(18,2)) as'KhuyenMai',ChiTietHoaDons.ThanhTien,ChiTietHoaDons.IsRefund,ChiTietHoaDons.SoLuongDaHoan,ChiTietHoaDons.MaLo,ChiTietHoaDons.Id_Kho,ChiTietHoaDons.IsBack,
		                        ROW_NUMBER() OVER (PARTITION BY ChiTietHoaDons.Id ORDER BY  ImageSanPhams.Id)  RowNum
		                        FROM SanPhams 
								LEFT JOIN ImageSanPhams 
								ON SanPhams.Id=ImageSanPhams.IdSanPham 
								inner join SanPhamBienThes
								on SanPhamBienThes.Id_SanPham = SanPhams.Id
								inner join Sizes
								on SanPhamBienThes.SizeId = Sizes.Id
								inner join MauSacs
								on SanPhamBienThes.Id_Mau = MauSacs.Id
								inner join ChiTietHoaDons
								on ChiTietHoaDons.Id_SanPhamBienThe = SanPhamBienThes.Id
								inner join HoaDons
								on HoaDons.Id = ChiTietHoaDons.Id_HoaDon
								where ChiTietHoaDons.Id_HoaDon = @value
		                          )
                                SELECT Id,Ten,ImageName,TenSize,MaMau,Soluong,GiaBan,KhuyenMai,ThanhTien,IsRefund,SoLuongDaHoan,MaLo,Id_Kho,IsBack
		                        from ProductImageTable
	                            where
                                ProductImageTable.RowNum = 1
";
            SqlConnection cnn;
            cnn = new SqlConnection(_context.Database.GetConnectionString());
            SqlDataReader reader;
            SqlCommand cmd;
            var list = new List<NhieuChiTietHoaDon>();
            await cnn.OpenAsync();
            SqlParameter param = new SqlParameter();
            cmd = new SqlCommand(sql, cnn);
            param.ParameterName = "@value";
            param.Value = id;
            cmd.Parameters.Add(param);
            reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    list.Add(new NhieuChiTietHoaDon()
                    {
                        Id = (int)reader["Id"],
                        Ten = (string)reader["Ten"],
                        Hinh = (string)reader["ImageName"],
                        GiaBan = (decimal)reader["GiaBan"],
                        KhuyenMai = (decimal)reader["KhuyenMai"],
                        MauSac = (string)reader["MaMau"],
                        Size = (string)reader["TenSize"],
                        MaLo = (string)reader["MaLo"],
                        SoLuong = (int)reader["SoLuong"],
                        Id_Kho = (int)reader["Id_Kho"],
                        ThanhTien = (decimal)reader["ThanhTien"],
                        IsRefund = reader["IsRefund"] != DBNull.Value ? (bool)reader["IsRefund"] : false,
                        IsBack = reader["IsBack"] != DBNull.Value ? (bool)reader["IsBack"] : false,
                        SoLuongDaHoan = reader["SoLuongDaHoan"] != DBNull.Value ? (int)reader["SoLuongDaHoan"] : 0
                    });
                }
            }
            await cnn.CloseAsync();
            var hd = from h in _context.HoaDons
                     join us in _context.AppUsers
                         on h.Id_User equals us.Id into gj
                     from us in gj.DefaultIfEmpty() // Đây là LEFT JOIN
                     select new MotHoaDon()
                     {
                         Id = h.Id,
                         FullName = us != null ? us.LastName + " " + us.FirstName : h.TenKhachHang,
                         DiaChi = h.Tinh != null ? h.Tinh + '-' + h.Huyen + '-' + h.Xa + '-' + h.DiaChi : us != null ? us.DiaChi : "",
                         Email = us != null ? us.Email : "",
                         SDT = us != null ? us.SDT :  h.SDT,
                         hoaDon = new HoaDon()
                         {
                             Id_User = h.Id_User,
                             TongTien = h.TongTien,
                             GhiChu = h.GhiChu,
                             NgayTao = h.NgayTao,
                             TrangThai = h.TrangThai,
                             LoaiThanhToan = h.LoaiThanhToan,
                             IsPayed = h.IsPayed
                         },
                         chiTietHoaDons = list
                     };
            return await hd.FirstOrDefaultAsync(s => s.Id == id);
        }
        public async Task<MotHoaDon> GetOneOrder(int id)
        {
            string sql = @"		;with ProductImageTable
	                            as (
		                        SELECT ChiTietHoaDons.Id,SanPhams.Ten,ImageSanPhams.ImageName,Sizes.TenSize,MauSacs.MaMau,ChiTietHoaDons.Soluong,cast(SanPhams.GiaBan as decimal(18,2)) as'GiaBan',ChiTietHoaDons.ThanhTien,ChiTietHoaDons.IsRefund,ChiTietHoaDons.SoLuongDaHoan,
		                        ROW_NUMBER() OVER (PARTITION BY ChiTietHoaDons.Id ORDER BY  ImageSanPhams.Id)  RowNum
		                        FROM SanPhams 
								LEFT JOIN ImageSanPhams 
								ON SanPhams.Id=ImageSanPhams.IdSanPham 
								inner join SanPhamBienThes
								on SanPhamBienThes.Id_SanPham = SanPhams.Id
								inner join Sizes
								on SanPhamBienThes.SizeId = Sizes.Id
								inner join MauSacs
								on SanPhamBienThes.Id_Mau = MauSacs.Id
								inner join ChiTietHoaDons
								on ChiTietHoaDons.Id_SanPhamBienThe = SanPhamBienThes.Id
								inner join HoaDons
								on HoaDons.Id = ChiTietHoaDons.Id_HoaDon
								where ChiTietHoaDons.Id_HoaDon = @value
		                          )
		                        SELECT Id,Ten,ImageName,TenSize,MaMau,Soluong,GiaBan,ThanhTien,IsRefund,SoLuongDaHoan
		                        from ProductImageTable
	                            where
                                ProductImageTable.RowNum = 1
";
            SqlConnection cnn;
            cnn = new SqlConnection(_context.Database.GetConnectionString());
            SqlDataReader reader;
            SqlCommand cmd;
            var list = new List<NhieuChiTietHoaDon>();
            await cnn.OpenAsync();
            SqlParameter param = new SqlParameter();
            cmd = new SqlCommand(sql, cnn);
            param.ParameterName = "@value";
            param.Value = id;
            cmd.Parameters.Add(param);
            reader = await cmd.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                while (await reader.ReadAsync())
                {
                    list.Add(new NhieuChiTietHoaDon()
                    {
                        Id = (int)reader["Id"],
                        Ten = (string)reader["Ten"],
                        Hinh = (string)reader["ImageName"],
                        GiaBan = (decimal)reader["GiaBan"],
                        MauSac = (string)reader["MaMau"],
                        Size = (string)reader["TenSize"],
                        SoLuong = (int)reader["SoLuong"],
                        ThanhTien = (decimal)reader["ThanhTien"],
                        IsRefund = reader["IsRefund"] != DBNull.Value ? (bool)reader["IsRefund"] : false,
                        SoLuongDaHoan = reader["SoLuongDaHoan"] != DBNull.Value ? (int)reader["SoLuongDaHoan"] : 0
                    });
                }
            }
            await cnn.CloseAsync();
            var hd = from h in _context.HoaDons
                     join us in _context.AppUsers
                     on h.Id_User equals us.Id
                     select new MotHoaDon()
                     {
                         Id = h.Id,
                         FullName = us.LastName + ' ' + us.FirstName,
                         DiaChi = h.Tinh != null ? h.Tinh + '-' + h.Huyen + '-' + h.Xa + '-' + h.DiaChi : us.DiaChi,
                         Email = us.Email,
                         SDT = us.SDT,
                         hoaDon = new HoaDon()
                         {
                             Id_User = h.Id_User,
                             TongTien = h.TongTien,
                             GhiChu = h.GhiChu,
                             NgayTao = h.NgayTao,
                             TrangThai = h.TrangThai,
                             IsPayed = h.IsPayed ,
                             LoaiThanhToan=h.LoaiThanhToan,
                             
                         },
                         chiTietHoaDons = list,
                     };
            var result = await hd.FirstOrDefaultAsync(s => s.Id == id);
            return result;
        }
    }
}
