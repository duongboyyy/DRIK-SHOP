import { Injectable, Injector } from "@angular/core";
import { BaseService } from "../admin/containers/views/account/base.service";
import { HttpClient } from "@angular/common/http";
import { BaseDefaultService } from "../admin/services/base-default.service";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
export class StatisticsService extends BaseDefaultService {

    constructor(http: HttpClient, injector: Injector) {
        super(http, injector, `${environment.URL_API1}/ThongKeBieuDos`);
    }

    Report_chart_DonHang(dateType: number, yearNumber: number, monthNumber: number, idProvince: number, idShop: number) {
        const queryString = `${this.serviceUri}/Report_chart_DonHang?dateType=${dateType}&yearNumber=${yearNumber}&monthNumber=${monthNumber}&idShop=${idShop}`;
        return this.defaultGet(queryString);
    }

    Report_DoanhSoTheoNhaCungCap(startDate: Date, endDate: Date) {
        let fDate;
        if (startDate) {
           fDate = startDate.toISOString();
        }
        let tDate;
        if (endDate) {
           tDate = endDate.toISOString();
        }
        const queryString = `${this.serviceUri}/Report_DoanhSoTheoNhaCungCap?startDate=${fDate}&endDate=${tDate}`;
        return this.defaultGet(queryString);
     }

     
     Report_TonKhoCuaHang(key: string, idCuaHang: number, idNhaCungCap: number, trangThai: string, offset: number, limit: number) {
    const queryString = `${this.serviceUri}/Report_TonKhoCuaHang?key=${key}&idCuaHang=${idCuaHang}&idNhaCungCap=${idNhaCungCap}&trangThai=${trangThai}&offset=${offset}&limit=${limit}`;
    return this.defaultGet(queryString);
 }


    // Report_chart_Order_Shop(dateType: number, idProvince: number) {
    //     const queryString = `${this.serviceUri}/Report_chart_Order_Shop?dateType=${dateType}&idProvince=${idProvince}`;
    //     return this.defaultGet(queryString);
    // }
    // Report_chart_Order_Provinces(dateType: number) {
    //     const queryString = `${this.serviceUri}/Report_chart_Order_Provinces?dateType=${dateType}`;
    //     return this.defaultGet(queryString);
    // }
    // Report_chart_Order_PaymentChannel(dateType: number) {
    //     const queryString = `${this.serviceUri}/Report_chart_Order_PaymentChannel?dateType=${dateType}`;
    //     return this.defaultGet(queryString);
    // }
}

