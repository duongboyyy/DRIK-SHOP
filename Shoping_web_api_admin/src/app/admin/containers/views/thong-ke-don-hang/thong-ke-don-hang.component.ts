import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { Chart } from 'chart.js';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { ConfigurationService } from '../../../../services/configuration.service';
import { StatisticsService } from '../../../../services/statistic.service';

@Component({
    selector: 'app-thong-ke-don-hang',
    templateUrl: './thong-ke-don-hang.component.html',
    styleUrls: ['./thong-ke-don-hang.component.scss']
})
export class ThongKeDonHangComponent extends SecondPageIndexBase implements OnInit {

    searchModel: any = {
        idProvince: -1,
        idShop: -1,
        dateType: 0,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    };
    list_units: any = [];
    list_shops: any = [];
    list_year: any = [];
    list_month: any = [];
    list_dateType = [];
    colFilter: any = {};
    disabled = false;
    openSearchAdv = true;
    vi: any;
    barchartTotalOrder = null;
    barchartTotalBill = null;

    constructor(
        protected _injector: Injector,
        private _configurationService: ConfigurationService,
        private _StatisticsService: StatisticsService,
    ) {
        super(_injector);
    }

    async ngOnInit() {
        this.vi = this._configurationService.calendarVietnamese;

        await this.loadYears();
        await this.loadMonth();
        await this.loadDateType();
        this.searchModel.month = new Date().getMonth() + 1;
        await this.getData();
    }
    async loadDateType() {
        this.list_dateType = [];
        this.list_dateType.push({ label: 'Ngày', value: 0 });
        this.list_dateType.push({ label: 'Tuần', value: 1 });
        this.list_dateType.push({ label: 'Tháng', value: 2 });
        this.list_dateType.push({ label: 'Năm', value: 3 });
    }
    async loadYears() {
        this.list_year = [];
        for (let value = this.searchModel.year; value >= 2020; value--) {
            this.list_year.push({ label: 'Năm ' + value, value: value });
        }
    }
    async loadMonth() {
        this.list_month = [];
        for (let month = 1; month <= 12; month++) {
            this.list_month.push({ label: 'Tháng ' + month, value: month });
        }
    }

    // async loadUnits() {
    //     this.list_units = [];
    //     await this._ProvincesService.GetShortProduct(-1, -1).then(rs => {
    //         if (rs.status) {
    //             rs.data.forEach(item => {
    //                 this.list_units.push({ label: item.label, value: item.value });
    //             });
    //         }
    //     });
    // }

    // async loadShops() {
    //     this.list_shops = [];
    //     await this._ShopsService.GetShortByLocationSelect(-1, this.searchModel.idProvince, -1, -1, -1).then(rs => {
    //         if (rs.status) {
    //             rs.data.forEach(item => {
    //                 this.list_shops.push({ label: item.code + ' - ' + item.name, value: item.value });
    //             });
    //         }
    //     });
    // }

    initDefaultOption() {
        this.searchModel.key = '';
    }
    async getData() {
        this.isLoading = true;
        this.dataSource = [];
        if (!this.searchModel.idProvince) {
            this.searchModel.idProvince = -1;
        }
        await this._StatisticsService.Report_chart_DonHang(
            this.searchModel.dateType,
            this.searchModel.year != null ? this.searchModel.year : -1,
            this.searchModel.month != null ? this.searchModel.month : -1,
            this.searchModel.idProvince != null ? this.searchModel.idProvince : -1,
            this.searchModel.idShop != null ? this.searchModel.idShop : -1
        ).then(rs => {
            if (rs.status) {
                // console.log("du lieu thong ke = " + JSON.stringify(rs.data));
                this.dataSource = rs.data;
                this.dataTotal = [rs.dataTotal];
                this.total = rs.totalRecord;
                this.loadbarchartTotalOrder(this.dataSource);
                this.loadbarchartTotalBill(this.dataSource);
            } else {
                this._notifierService.showError(rs.message);
            }
        });
        this.resetBulkSelect();
        this.isLoading = false;
    }

    async loadbarchartTotalOrder(datachar: any) {
        var Player = [];
        var chartthanhCong = {
            label: 'Thành công',
            data: [],
            backgroundColor: 'rgba(0, 166, 81, 1)',
            borderColor: 'rgba(0, 99, 132, 1)',
        };
        var chartTongdon = {
            label: 'Tổng đơn',
            data: [],
            backgroundColor: 'rgba(45, 166, 254, 1)',
            borderColor: 'rgba(99, 132, 0, 1)',
        };
        var chartChuaHoanThanh = {
            label: 'Chưa hoàn thành',
            data: [],
            backgroundColor: 'rgba(165, 0, 100, 1)',
            borderColor: 'rgba(99, 132, 0, 1)',
        };
        var chartKhachHuy = {
            label: 'hủy',
            data: [],
            backgroundColor: 'rgba(253, 107, 107, 1)',
            borderColor: 'rgba(106, 224, 145, 1)',
            stack: 'Huy',
        };
        var chartSaleHuy = {
            label: 'Shop hủy',
            data: [],
            backgroundColor: 'rgba(255, 0, 0, 1)',
            borderColor: 'rgba(106, 224, 145, 1)',
            stack: 'Huy',
        };

        datachar.forEach(x => {

            if (this.searchModel.dateType == 1)
                Player.push("Tuần " + x.createdDate);
            else if (this.searchModel.dateType == 2)
                Player.push("Tháng " + x.createdDate);
            else if (this.searchModel.dateType == 3)
                Player.push("Năm " + x.createdDate);
            else
                Player.push(x.createdDate);
                chartTongdon.data.push(x.totalOrder);
                chartthanhCong.data.push(x.donHoanThanh);
                chartChuaHoanThanh.data.push(
                    x.donChuaXacNhan + x.donDaXacNhan + x.dangGiaoHang + x.choThanhToan
                );
                chartKhachHuy.data.push(x.donDaHuy);
        });

        var planetData = {
            labels: Player,
        datasets: [chartthanhCong, chartChuaHoanThanh, chartKhachHuy],        };
        if (this.barchartTotalOrder != null) {
            this.barchartTotalOrder.destroy();
        }
        var chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true
            },
            interaction: {
                intersect: false,
            },
            scales: {
                xAxes: [{
                    stacked: true, // Trục X xếp chồng
                }],
                yAxes: [{
                    stacked: true // Trục Y xếp chồng
                }]
            },
            title: {
                display: true,
                text: 'Biểu đồ số đơn hàng (đơn)'
            }
        };
        
        this.barchartTotalOrder = new Chart('myChartTotalOrder', {
            type: 'bar',
            data: planetData,
            options: chartOptions
        });
        
    }
    async loadbarchartTotalBill(datachar: any) {
        var Player = [];
        var Run = [];
        //var myChart = null;
        datachar.forEach(x => {

            if (this.searchModel.dateType == 1)
                Player.push("Tuần " + x.createdDate);
            else if (this.searchModel.dateType == 2)
                Player.push("Tháng " + x.createdDate);
            else if (this.searchModel.dateType == 3)
                Player.push("Năm " + x.createdDate);
            else
                Player.push(x.createdDate);
            //Player.push(x.createdDate);
            Run.push(x.totalBill);
        });
        if (this.barchartTotalBill != null) {
            this.barchartTotalBill.destroy();
        }
        var ctx = document.getElementById("myChartTotalBill") as HTMLCanvasElement;
        this.barchartTotalBill = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Player,
                datasets: [{
                    data: Run,
                    label: '# Doanh số',
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    spanGaps: false,
                    // label: '# Doanh số',
                    // backgroundColor: 'rgba(26, 13, 171, 1)',
                    // borderColor: 'rgba(99, 132, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            callback: function (value, index, values) {
                                return value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ' : ' + tooltipItem.yLabel.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Biểu đồ số doanh số bán hàng (đồng)'
                },
            }
        });
    }


    async onSearch() {

        if (this.searchModel.dateType == 0 && (this.searchModel.year <= 0 || this.searchModel.month <= 0)) {
            this.searchModel.year = new Date().getFullYear();
            this.searchModel.month = new Date().getMonth();
        }
        else if (this.searchModel.dateType == 1 && this.searchModel.year <= 0) {
            this.searchModel.year = new Date().getFullYear();
        }
        else if (this.searchModel.dateType == 2 && this.searchModel.year <= 0) {
            this.searchModel.year = new Date().getFullYear();
        }

        await this.getData();
    }
    toggleSearch() {
        super.toggleSearch();
        this.fixTableScrollProblem();
    }
    onChangeRowLimit() {
        this.fixTableScrollProblem();
    }
    // fix vụ lệch header ở table khi xuất hiện thanh scroll
    fixTableScrollProblem() {
        this.dataSource = [...this.dataSource];
    }

    onCloseForm() {
        this.getData();
    }

}
