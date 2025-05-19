import { Component, OnInit, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { ConfigurationService } from '../../../../services/configuration.service';
import { StatisticsService } from '../../../../services/statistic.service';

@Component({
  selector: 'app-bao-cao-tong-hop-theo-ncc',
  templateUrl: './bao-cao-tong-hop-theo-ncc.component.html',
  styleUrls: ['./bao-cao-tong-hop-theo-ncc.component.scss']
})
export class BaoCaoTongHopTheoNccComponent extends SecondPageIndexBase implements OnInit {

  searchModel: any = {
    fromDate: new Date(),
    toDate: new Date(),
    isByTdv: false
  };

  colFilter: any = {};
  disabled = false;
  openSearchAdv = true;
  vi: any;
  constructor(
    protected _injector: Injector,
    private _configurationService: ConfigurationService,
    private _StatisticsService: StatisticsService,
  ) {
    super(_injector);
  }

  async ngOnInit() {
    this.vi = this._configurationService.calendarVietnamese;
    //this.searchModel.fromDate.setDate(this.searchModel.toDate.getDate());
    await this.getData();
  }

  loadCol() {

    this.cols = [
      {
        field: 'maNhaCungCap',
        header: 'Mã NCC',
        visible: true,
        align: 'left',
        width: '150px',
      },
      {
        field: 'tenNhaCungCap',
        header: 'Tên NCC',
        visible: true,
        align: 'left',
        sort: true,
        width: '30%',
      },
      {
        field: 'soDonHang',
        header: 'Số đơn hàng',
        visible: true,
        align: 'right',
        width: '8%',
        sort: true,
      },
      {
        field: 'doanhSo',
        header: 'Doanh số',
        visible: true,
        align: 'right',
        width: '8%',
        sort: true,
      }
    ];
  }

  initDefaultOption() {
    this.searchModel.key = '';
  }
  async getData() {
    this.loadCol();
    this.isLoading = true;
    this.dataSource = [];
    await this._StatisticsService.Report_DoanhSoTheoNhaCungCap(
      this.searchModel.fromDate,
      this.searchModel.toDate,
    ).then(rs => {
      if (rs.status) {
        this.dataSource = rs.data;
        this.dataTotal = [rs.dataTotal];
        this.total = rs.data.length;
      } else {
        this._notifierService.showError(rs.message);
      }
    });
    this.resetBulkSelect();
    this.isLoading = false;
  }
  onSearch() {
    this.getData();
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
