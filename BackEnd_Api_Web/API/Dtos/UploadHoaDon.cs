﻿using API.Dtos.ModelRequest;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace API.Dtos
{
    public class UploadHoaDon
    {
        public int TrangThai { get; set; }
        public List<ChiTietHoanHangRequest> ChiTietHoanHangs { get; set; }
    }
}