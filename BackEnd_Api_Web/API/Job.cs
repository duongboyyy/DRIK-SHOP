using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using API.Helper;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.IO;
using API.Data;
using API.Models;
using API.Helper.SignalR;
using Microsoft.AspNetCore.SignalR;

namespace DapFood.API
{
    public class Job : IHostedService, IDisposable
    {
        private static readonly object Object = new object();
        private readonly ILogger _logger;
        private Timer _timer;
        public DateTime LastExecuted { get; set; } = DateTime.Now;
        public DateTime SyncOrderStatusLastExecuted { get; set; } = DateTime.Now;
        public int SyncProductStockLastExecuted { get; set; } = DateTime.Now.Hour;  // Một ngày đồng bộ nhiều lần nên phải set theo giờ
        public DateTime MergeOrderNeedShipLastExecuted { get; set; } = DateTime.Now;
        public DateTime MergeOrderWattingShipLastExecuted { get; set; } = DateTime.Now;
        public DateTime UserAddressLocationLastExecuted { get; set; } = DateTime.Now;
        public bool runOne = true;
        private readonly IServiceScopeFactory _scopeFactory;

        public Job(
            ILogger<Job> logger,
            IServiceScopeFactory scopeFactory
            )
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(50));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            //lock đối tượng
            lock (Object)
            {
                //System.Diagnostics.Debug.WriteLine("JOB: Start");
                Console.WriteLine("JOB: Start");

                // Kéo tồn mỗi giờ 1 lần vào lúc 0 phút
                if ((DateTime.Now.Hour >= 6 && DateTime.Now.Hour <= 22) && DateTime.Now.Minute == 0)    //Không cần && DateTime.Now.Hour != SyncProductStockLastExecuted vì ở trên set cứ 50s chạy 1 lần rồi nên ở thời điểm o phút nó chỉ chạy được 1 lần
                {
                    Console.WriteLine("JOB SyncProductStock");
                    //SyncProductStockLastExecuted = DateTime.Now.Hour; 
                }

                // Cảnh báo hết hàng
                if ((DateTime.Now.Hour >= 6 && DateTime.Now.Hour <= 22) && DateTime.Now.Minute % 5 == 0)
                {
                    Console.WriteLine("JOB NotiInventoryNotification");
                    Noti();
                }

                // Thực hiện vào 2 giờ sáng hàng ngày và chỉ thực hiện 1 lần trong ngày
                if (DateTime.Now.Hour == 3 && DateTime.Now.Minute == 0 && DateTime.Now.Date != SyncOrderStatusLastExecuted.Date)
                {
                    Console.WriteLine("JOB SyncOrderStatusLastExecuted");
                    SyncOrderStatusLastExecuted = DateTime.Now;
                }

                if ((DateTime.Now.Hour == 6 || DateTime.Now.Hour == 11 || DateTime.Now.Hour == 16 || DateTime.Now.Hour == 21) && DateTime.Now.Minute == 0)
                {
                    Console.WriteLine("JOB: Cảnh báo tồn kho");
                    InventoryNotification();
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Timed Background Service is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        private void InventoryNotification()
        {
            using var scope = _scopeFactory.CreateScope();
            var _context = scope.ServiceProvider.GetRequiredService<DPContext>();
            var _hub = scope.ServiceProvider.GetRequiredService<IHubContext<BroadcastHub, IHubClient>>();

            var sanPhamsCanhBao = _context.SanPhamKho
                .Where(x => x.IsActive == true && x.SoLuong < x.SoLuongCanhBao)
                .Select(x => new
                {
                    x.Id,
                    x.SanPhamBienTheId,
                    x.SoLuong,
                    x.SoLuongCanhBao,
                    x.MaLo
                }).ToList();

            if (sanPhamsCanhBao.Any())
            {
                foreach (var sp in sanPhamsCanhBao)
                {
                    Console.WriteLine($"⚠️ Cảnh báo tồn kho: Sản phẩm {sp.SanPhamBienTheId}, Lô: {sp.MaLo}, SL hiện tại: {sp.SoLuong}, SL cảnh báo: {sp.SoLuongCanhBao}");

                    // Nếu có bảng Notification -> thêm vào DB:

                    var notify = new Notification()
                    {
                        Title = "Cảnh báo tồn kho",
                        Content = $"Sản phẩm {sp.SanPhamBienTheId} có tồn kho thấp hơn mức cảnh báo.",
                        CreatedDate = DateTime.Now,
                        Type = 1,
                        SendTo = "Admin"
                    };
                    _context.Notifications.Add(notify);

                }
                _context.SaveChanges();
            }
        }


        private void Noti()
        {
            using var scope = _scopeFactory.CreateScope();
            //var productsService = scope.ServiceProvider.GetRequiredService<IProductsService>();
            //productsService.InventoryNotification();
        }

    }
}
