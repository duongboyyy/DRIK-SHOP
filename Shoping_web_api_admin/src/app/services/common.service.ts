import { Injectable, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';

enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
}
@Injectable({
    providedIn: 'root'
})
export class CommonService {

    topbarItemClick: boolean;

    activeTopbarItem: any;

    topbarMenuActive: boolean;

    menuClick: boolean;

    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    resetMenu: boolean;

    overlayMenuActive: boolean;

    rotateMenuButton: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;

    constructor() { }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    stringFormat(inputString: string, ...args) {
        // tslint:disable-next-line:forin
        for (const index in args) {
            inputString = inputString.replace(`{${index}}`, args[index]);
        }

        return inputString;
    }

    htmlEncode(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&quot;');
    }

    // Lấy về giá trị theo path ''
    getValueByPath(obj: any, path: string): string {
        const paths = path.split('.');
        for (let i = 0; i < paths.length; i++) {
            try {
                obj = obj[paths[i]];
            } catch (err) {
                obj = null;
            }

        }
        return obj;
    }

    addDays(date: Date, days) {
        const cloned = new Date(date);
        cloned.setDate(date.getDate() + days);
        return cloned;
    }

    addWorkDays(date, days) {
        const cloned = new Date(date);
        while (days > 0) {
            cloned.setDate(cloned.getDate() + 1);
            if (cloned.getDay() !== 0 && cloned.getDay() !== 6) {
                days -= 1;
            }
        }
        return cloned;
    }

    exportToCSV(datas: any[], columns: any[], fileName: string): void {
        let headerString = '';
        // Duyệt cột để thêm vào header
        columns.forEach(c => {
            headerString += c.header + ',';
        });

        const rowsString: string[] = [];
        datas.forEach(d => {
            let rowString = '';
            columns.forEach(c => {
                // rowString += (typeof d[c.field]).toString() + ',';
                let colVal = '';
                if (c.dataPath) {
                    const colValTmp = this.getValueByPath(d, c.dataPath);
                    if (colValTmp) {
                        colVal = colValTmp;
                    }
                } else if (d[c.field]) {
                    colVal = d[c.field];
                }
                // Format Date
                if (c.dateFormat) {
                    const datePipe = new DatePipe('en-US');
                    colVal = datePipe.transform(colVal, c.dateFormat);
                }
                // Format mapping
                if (c.dataMapping) {
                    c.dataMapping.forEach(dm => {
                        if (dm.value === d[c.field]) {
                            colVal = dm.label.toString().replace(',', '.').replace('\n', '').replace('\r', '');
                        }
                    });
                }
                if (colVal) {
                    rowString += colVal.toString().replace(',', '.').replace('\n', '').replace('\r', '') + ',';
                } else {
                    rowString += '' + ',';
                }
            });
            rowsString.push(rowString);
        });
        let csv = headerString + '\n';
        for (const row of rowsString) {
            csv += row + '\n';
        }
        const blob = new Blob(['\uFEFF', csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(blob));
        link.setAttribute('download', fileName + '.csv');
        document.body.appendChild(link); // Required for FF
        link.click();
    }

    exportToCSV2(datas: any[], columns: any[], fileName: string): void {
        let headerString = '';
        // Duyệt cột để thêm vào header
        columns.forEach(c => {
            headerString += c.header + ',';
        });

        const rowsString: string[] = [];
        datas.forEach(d => {
            let rowString = '';
            columns.forEach(c => {
                // rowString += (typeof d[c.field]).toString() + ',';
                let colVal = '';
                if (c.dataPath) {
                    const colValTmp = this.getValueByPath(d, c.dataPath);
                    if (colValTmp) {
                        colVal = colValTmp;
                    }
                } else if (d[c.field]) {
                    colVal = d[c.field];
                }
                // Format Date
                if (c.dateFormat) {
                    const datePipe = new DatePipe('en-US');
                    colVal = datePipe.transform(colVal, c.dateFormat);
                }
                // Format mapping
                if (c.dataMapping) {
                    c.dataMapping.forEach(dm => {
                        if (dm.id === d[c.field]) {
                            colVal = dm.name.toString().replace(',', '.').replace('\n', '').replace('\r', '');
                        }
                    });
                }
                if (colVal) {
                    rowString += colVal.toString().replace(',', '.').replace('\n', '').replace('\r', '') + ',';
                } else {
                    rowString += '' + ',';
                }
            });
            rowsString.push(rowString);
        });
        let csv = headerString + '\n';
        for (const row of rowsString) {
            csv += row + '\n';
        }
        const blob = new Blob(['\uFEFF', csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(blob));
        link.setAttribute('download', fileName + '.csv');
        document.body.appendChild(link); // Required for FF
        link.click();
    }

    exportToCSVGroup(datas: any, columns: any[], fileName: string): void {
        let headerString = '';
        // Duyệt cột để thêm vào header
        for (let i = 0; i < columns.length; i++) {
            headerString += columns[i].header + ',';
        }

        const rowsString: string[] = [];
        datas.forEach(subData => {
            rowsString.push(subData.groupName);
            rowsString.push(headerString);

            subData.data.forEach(d => {
                let rowString = '';
                columns.forEach(c => {
                    let colVal = '';
                    if (c.dataPath) {
                        const colValTmp = this.getValueByPath(d, c.dataPath);
                        if (colValTmp) {
                            colVal = colValTmp;
                        }
                    } else if (d[c.field]) {
                        colVal = d[c.field];
                    }
                    // Format Date
                    if (c.dateFormat) {
                        const datePipe = new DatePipe('en-US');
                        colVal = datePipe.transform(colVal, c.dateFormat);
                    }
                    // Format mapping
                    if (c.dataMapping) {
                        c.dataMapping.forEach(dm => {
                            if (dm.id === d[c.field]) {
                                colVal = dm.name.toString().replace(',', '.').replace('\n', '').replace('\r', '');
                            }
                        });
                    }
                    if (colVal) {
                        rowString += colVal.toString().replace(',', '.').replace('\n', '').replace('\r', '') + ',';
                    } else {
                        rowString += '' + ',';
                    }
                });
                rowsString.push(rowString);
            });

            rowsString.push('\n');
        });

        // let csv = headerString + '\n';
        let csv = '';
        for (const row of rowsString) {
            csv += row + '\n';
        }
        const blob = new Blob(['\uFEFF', csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(blob));
        link.setAttribute('download', fileName + '.csv');
        document.body.appendChild(link); // Required for FF
        link.click();
    }

    convertToSelectItem(data: any, valueField: string, textField: string = '', textField2: string = '', prefixTextField2 = '', allowNull: boolean = true): SelectItem[] {
        if (!textField || textField === '') {
            textField = valueField;
        }

        const tempArr: SelectItem[] = [];

        if (allowNull) {
            tempArr.push({ label: '', value: '' });
        }

        // tslint:disable-next-line:forin
        for (const ind in data) {
            const item = data[ind];
            tempArr.push({ label: this.getLabel(item, textField, textField2, prefixTextField2), value: item[valueField] });
        }
        return tempArr;
    }

    getLabel(item: any, textField: string, textField2: string, prefixTextField2: string) {
        if (textField2) {
            return item[textField] + ' - ' + prefixTextField2 + ' ' + item[textField2];
        } else {
            return item[textField];
        }
    }

    convertToSelectItemMasterData(data: any, valueField: string = 'id', textField: string = 'name'): SelectItem[] {
        return this.convertToSelectItem(data, valueField, textField);
    }

    // handleError(error: any, injector: Injector) {
    //     // console.error('Có lỗi xảy ra', error);
    //     if (error.status === 401) {
    //         const authenService = injector.get(VsAuthenService);
    //         authenService.logout();
    //     } else {
    //     }
    //     return Promise.reject(error);
    // }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }
    isHorizontal() {
        return this.layoutMode === MenuOrientation.HORIZONTAL;
    }
    isSlim() {
        return this.layoutMode === MenuOrientation.SLIM;
    }
    hideOverlayMenu() {
        this.rotateMenuButton = false;
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }
    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
    }

}


