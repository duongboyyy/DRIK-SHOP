import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { ChartSecondService } from '../chart-second.service';
import { DataSource } from '@angular/cdk/collections';
@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.scss']
})
export class SelectMonthComponent implements OnInit {
  constructor(public service:ChartSecondService,
              public http: HttpClient) { }
  public newFormGroup: FormGroup;
  ngOnInit(): void {
    this.newFormGroup = new FormGroup({
      Thang: new FormControl(null,
        [
        ]),
    });
  }
  onSubmit = (data) => {
    const formData = new FormData();
    formData.append("month", data.Thang)
    this.http.post(environment.URL_API + "ThongKeBieuDos/topthongkengaytheothang", formData).subscribe(
      (result: any) => {
        this.service.dataThongKeNgay = result as any
        if (this.service.dataThongKeNgay.length != 0) {
          this.service.dataThongKeNgay = result as any
          this.service.dataSourceNgay.data = Array.from({ length: 32 }, () => ({ label: "", value: "" }));
          console.log(this.service.dataThongKeNgay);

          for (var i = 0; i < this.service.dataThongKeNgay.length; i++) {
            const rawDate = this.service.dataThongKeNgay[i].ngay;
            const date = new Date(rawDate); // Convert về đối tượng Date
            const day = date.getDate();
            this.service.dataSourceNgay.data[day].label = day.toString();
            this.service.dataSourceNgay.data[day].value = this.service.dataThongKeNgay[i].revenues as any
          }
          console.log("a",this.service.dataSourceNgay)
        }
        else {
          for (var i = 1; i < 32; i++) {
            this.service.dataSourceNgay.data[i].label = ""
            this.service.dataSourceNgay.data[i].value = ""
          }
        }
      },
      error => {
      }
    )
  }
}
