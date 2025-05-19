import { Injectable } from '@angular/core';
import { MessageService, ConfirmationService, Message } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponseBase } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class NotifierService {

    constructor(
        private _messageService: MessageService,
        private _confirmService: ConfirmationService,
        private _translateService: TranslateService
    ) {

    }
    Clear() {
        this._messageService.clear();
    }

    showSuccess(message: string, header: string = '', life: number = 10000) {
        this._messageService.add({
            severity: 'success',
            summary: header,
            detail: message,
            life: life
        });
    }

    showChat(message: string, header: string = '', life: number = 6000) {
        this._messageService.add({
            severity: 'info',
            summary: "Tin nhắn mới",
            detail: message,
            life: life
        });
    }

    showInsertDataSuccess(life: number = 10000) {
        this._messageService.add({
            severity: 'success',
            summary: this._translateService.instant('MESSAGE.INSERT_DATA_SUCCESS'),
            detail: this._translateService.instant('MESSAGE.COMMON_SUCCESS_HEADER'),
            life: life
        });
    }

    showUpdateDataSuccess(life: number = 10000) {
        this._messageService.add({
            severity: 'success',
            summary: this._translateService.instant('MESSAGE.UPDATE_DATA_SUCCESS'),
            detail: this._translateService.instant('MESSAGE.COMMON_SUCCESS_HEADER'),
            life: life
        });
    }

    showDeleteDataSuccess(life: number = 5000) {
        this._messageService.add({
            severity: 'success',
            summary: this._translateService.instant('MESSAGE.DELETE_DATA_SUCCESS'),
            detail: this._translateService.instant('MESSAGE.COMMON_SUCCESS_HEADER'),
            life: life
        });
    }

    showDeleteDataError(life: number = 5000) {
        // this._messageService.add({
        //     severity: 'error',
        //     summary : this._translateService.instant('MESSAGE.DELETE_DATA_ERROR'),
        //     detail  : this._translateService.instant('MESSAGE.COMMON_ERROR_HEADER'),
        //     life    : life
        // });
    }

    showDeleteDataEmptyError(life: number = 5000) {
        // this._messageService.add({
        //     severity: 'error',
        //     summary : this._translateService.instant('Bạn phải chọn ít nhất 1 bản ghi để xóa'),
        //     detail  : this._translateService.instant('MESSAGE.COMMON_ERROR_HEADER'),
        //     life    : life
        // });
    }

    showWarning(message: string, header: string = '', life: number = 10000) {
        this._messageService.add({
            severity: 'warn',
            summary: header,
            detail: message,
            life: life
        });
    }

    showError(message: string, header: string = '', life: number = 10000) {
        this._messageService.add({
            // key: key,
            severity: 'error',
            summary: header,
            detail: message,
            life: life
        });
    }

    showHttpUnknowError(life: number = 10000) {
        this._messageService.add({
            severity: 'error',
            summary: this._translateService.instant('MESSAGE.HTTP_UNKNOW_ERROR_HEADER'),
            detail: this._translateService.instant('MESSAGE.HTTP_UNKNOW_ERROR'),
            life: life
        });
    }

    showResponseError(error: HttpResponseBase, life: number = 10000) {
        if (error.status === 404) {
            this._messageService.add({
                severity: 'error',
                summary: this._translateService.instant('MESSAGE.COMMON_ERROR_HEADER'),
                detail: this._translateService.instant('MESSAGE.NOT_FOUND_ERROR'),
                life: life
            });
        } else if (error.status === 401) {
            this._messageService.add({
                severity: 'error',
                summary: this._translateService.instant('MESSAGE.COMMON_ERROR_HEADER'),
                detail: this._translateService.instant('MESSAGE.UNAUTHORIZED_ERROR'),
                life: life
            });
        } else if (error.status === 403) {
            this._messageService.add({
                severity: 'error',
                summary: this._translateService.instant('MESSAGE.COMMON_ERROR_HEADER'),
                detail: this._translateService.instant('MESSAGE.ACCESS_DENINED_ERROR'),
                life: life
            });
        } else if (error.status === 500) {
            this._messageService.add({
                severity: 'error',
                summary: this._translateService.instant('MESSAGE.COMMON_ERROR_HEADER'),
                detail: this._translateService.instant('MESSAGE.INTERNAL_SERVER_ERROR'),
                life: life
            });
        } else if (error.status === 409) {
            this._messageService.add({
                severity: 'error',
                summary: this._translateService.instant('MESSAGE.COMMON_ERROR_HEADER'),
                detail: this._translateService.instant('MESSAGE.CONFLICT_ERROR'),
                life: life
            });
        } else {
            this._messageService.add({
                severity: 'error',
                summary: `Lỗi ${error.status}: `,
                detail: `${error.statusText}`,
                life: life
            });
        }
    }

    showInsertDataFailed(life: number = 10000) {
        this._messageService.add({
            severity: 'error',
            summary: this._translateService.instant('MESSAGE.INSERT_DATA_FAILED'),
            detail: this._translateService.instant('MESSAGE.COMMON_ERROR'),
            life: life
        });
    }

    showUpdateDataFailed(life: number = 10000) {
        this._messageService.add({
            severity: 'error',
            summary: this._translateService.instant('MESSAGE.UPDATE_DATA_FAILED'),
            detail: this._translateService.instant('MESSAGE.COMMON_ERROR'),
            life: life
        });
    }
    showUpdateDataSingleFailed(life: number = 10000) {
        // this._messageService.add({
        //     severity: 'error',
        //     summary : this._translateService.instant('MESSAGE.UPDATE_DATA_FAILED'),
        //     detail  : this._translateService.instant('Mã hoặc tên danh mục đã tồn tại'),
        //     life    : life
        // });
    }
    showUpdateDataConfigurationFailed(life: number = 10000) {
        // this._messageService.add({
        //     severity: 'error',
        //     summary : this._translateService.instant('Mật khẩu không được để trống'),

        //     life: life
        // });
    }
    showConfirm(message: string, header: string = '', icon: string = ''): Promise<any> {
        return new Promise((resolve, reject) => {
            this._confirmService.confirm({
                message: message,
                header: header,
                icon: icon,
                acceptLabel: this._translateService.instant('CONFIRM.ACCEPT_LABEL'),
                rejectLabel: this._translateService.instant('CONFIRM.REJECT_LABEL'),
                accept: () => {
                    resolve(null);
                },
                reject: () => {
                    reject();
                }
            });
        });
    }

    showDeleteConfirm(header: string = '', icon: string = ''): Promise<any> {
        return new Promise((resolve, reject) => {
            this._confirmService.confirm({
                message: this._translateService.instant('CONFIRM.DEFAULT_DELETE_CONFIRM'),
                header: this._translateService.instant('CONFIRM.DEFAULT_DELETE_CONFIRM_TITLE'),
                icon: icon,
                acceptLabel: this._translateService.instant('CONFIRM.ACCEPT_LABEL'),
                rejectLabel: this._translateService.instant('CONFIRM.REJECT_LABEL'),
                accept: () => {
                    resolve(null);
                },
                reject: () => {
                    reject();
                }
            });
        });
    }

    addErrorMessage(msgs: Message[], content) {
        msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Validation failed' });
    }

    clearErrorMessage(msgs: Message[]) {
        msgs.length = 0;
    }
}
