import { Component, Injector, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from '@microsoft/signalr';
import { ChartSecondService } from './chart-second.service';
import { SelectMonthComponent } from './select-month/select-month.component';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { ConfigurationService } from '../../../../services/configuration.service';

@Component({
  selector: 'app-chart-second',
  templateUrl: './chart-second.component.html',
  styleUrls: ['./chart-second.component.scss']
})
export class ChartSecondComponent extends SecondPageIndexBase implements OnInit {
  // Chart DataSources
  public dataSourceBrand = this.initPieChart();
  public dataSourceYear = this.initColumnChart('Doanh thu các tháng trong năm');
  public dataSourceSoLanXuatHien = this.initColumnChart('Top 10 sản phẩm bán chạy');
  public dataSourceDoanhThu = this.initColumnChart('Sản phẩm biến thể đạt top 10 doanh số cao nhất');
  searchModel: any = {
    fromDate: new Date(),
    toDate: new Date()
  };
  // Biến dữ liệu
  nam: any;
  errorMessage: any;
  soLanXuatHien: any = [];
  doanhthucaonhat: any = [];
  dataThongKe: any = [];
  listYears: any[] = [];
  selectedYear: any;
  vi: any;
  constructor(
    protected _injector: Injector,
    public service: ChartSecondService,
    private dialog: MatDialog,
    private zone: NgZone,
    private _configurationService: ConfigurationService,
  ) {
    super(_injector);
  }

  ngOnInit(): void {
    this.vi = this._configurationService.calendarVietnamese;
    // Gán danh sách năm
    for (let year = 2020; year <= 2050; year++) {
      this.listYears.push({ label: year.toString(), value: year });
    }
    
    // Gán giá trị mặc định cho selectedYear (năm hiện tại)
    this.selectedYear = { label: new Date().getFullYear().toString(), value: new Date().getFullYear() };
    
    // Load dữ liệu
    this.loadAllData();

    // Khởi tạo SignalR
    this.initSignalR();
  }

  // Khởi tạo biểu đồ cột
  private initColumnChart(caption: string) {
    return {
      chart: {
        caption,
        xAxisName: 'Tên sản phẩm',
        yAxisName: 'Giá trị',
        numberSuffix: '',
        theme: 'fusion'
      },
      data: Array.from({ length: 12 }, () => ({ label: "", value: "" }))
    };
  }

  // Khởi tạo biểu đồ tròn
  private initPieChart() {
    return {
      chart: {
        caption: "Tỉ lệ nhãn hiệu bán chạy",
        plottooltext: "$label đạt tỉ lệ <b>$percentValue</b>",
        showLegend: "1",
        showPercentValues: "1",
        legendPosition: "bottom",
        useDataPlotColorForLabels: "1",
        enablemultislicing: "0",
        theme: "fusion"
      },
      data: Array.from({ length: 5 }, () => ({ label: "", value: "" }))
    };
  }

  // Load toàn bộ dữ liệu ban đầu
  private loadAllData() {
    this.getNamdoanhso();
    
    // Kiểm tra nếu selectedYear đã có giá trị hợp lệ
    if (this.selectedYear) {
      this.getThongKeThang();
    }

    this.getSoLanXuatHienTrongDonHang();
    this.getTop10SanPhamLoiNhats();
    this.getSoLuongTrongNam();
  }

  // Cập nhật dữ liệu SignalR
  private initSignalR() {
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('https://localhost:44302/notify')
      .build();

    connection.start().then(() => console.log('SignalR Connected!'))
      .catch(err => console.error(err.toString()));

    connection.on("BroadcastMessage", () => {
      this.zone.run(() => this.loadAllData());
    });
  }

  // Dữ liệu năm
  getNamdoanhso() {
    this.service.getNamDoanhSo().subscribe(
      result => this.nam = result,
      error => this.errorMessage = error
    );
  }

  // Dữ liệu doanh thu theo tháng
  getThongKeThang() {
    console.log(this.selectedYear.value);  // Kiểm tra xem selectedYear có đúng không
    
    this.service.getThongKeThang(this.selectedYear.value).subscribe(
      (result: any) => {
        this.dataThongKe = result;
        // Kiểm tra dữ liệu và cập nhật lại biểu đồ nếu có dữ liệu
        this.dataSourceYear.data = result && result.length ? result.map((item: any) => ({
          label: item.month,
          value: item.revenues
        })) : [{ label: "Không có dữ liệu", value: 0 }];
      },
      error => this.errorMessage = error
    );
  }

  // Dữ liệu số lần xuất hiện trong đơn hàng
  getSoLanXuatHienTrongDonHang() {
    this.service.getSoLanSanPhamXuatHienTrongDonHang(this.searchModel.fromDate, this.searchModel.toDate).subscribe(
      (result: any[]) => {
        this.soLanXuatHien = result;
        this.dataSourceSoLanXuatHien.data = result && result.length ? result.map(x => ({
          label: x.tenSP,
          value: x.soLanXuatHienTrongDonHang
        })) : [{ label: "Không có dữ liệu", value: 0 }];
      },
      error => this.errorMessage = error
    );
  }

  // Dữ liệu sản phẩm có doanh thu cao
  getTop10SanPhamLoiNhats() {
    this.service.getSanPhamDoanhThuTop(this.searchModel.fromDate, this.searchModel.toDate).subscribe(
      (result: any[]) => {
        this.doanhthucaonhat = result;
        // Kiểm tra dữ liệu và cập nhật lại biểu đồ nếu có dữ liệu
        this.dataSourceDoanhThu.data = result && result.length ? result.map(x => ({
          label: x.tenSP,
          value: x.doanhSoCaoNhat
        })) : [{ label: "Không có dữ liệu", value: 0 }];
      },
      error => this.errorMessage = error
    );
  }

  // Dữ liệu số lượng theo năm
  getSoLuongTrongNam() {
    this.service.getNam2021SoLuong().subscribe(
      result => {},
      error => this.errorMessage = error
    );
  }

  // Dialog chọn tháng
  openDialog() {
    const dialogRef = this.dialog.open(SelectMonthComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
