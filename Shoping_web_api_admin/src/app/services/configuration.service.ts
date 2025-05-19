import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthConfig } from 'angular-oauth2-oidc'; // Ensure this is the correct package for AuthConfig

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {
    constructor() { }
    get maxFileSize(): number {
        return 1000000000;
    }

    get dateFormat(): string {
        return 'dd/MM/yyyy';
    }

    get dateTimeFormat(): string {
        return 'dd/MM/yyyy HH:mm:ss';
    }

    //   get apiLogs(): string {
    //     return `${environment.apiDomain.logEndpoint}/Logs`;
    //   }

    //   get loginUrl(): string {
    //     return `${environment.apiDomain.remoteStorageOrigin}/dang-nhap`;
    //   }

    get logSessionKey(): string {
        return 'log_session_key';
    }

    get defaultImageUrl(): string {
        return '';
    }

    // get apiFsFile(): string {
    //     return `${environment.URL_API.fileEndpoint}/Files`;
    // }

    // get apiFsFolder(): string {
    //     return `${environment.URL_API.fileEndpoint}/Folders`;
    // }

    get fsAppFolder(): string {
        return 'dapfood';
    }

    get googleViewOnline(): string {
        return 'https://docs.google.com/viewerng/viewer?embedded=false&url=';
    }

    // get fileUploadUrl(): string {
    //     return `${environment.URL_API.fileEndpoint}/upload`;
    // }

    // get notificationUrl(): string {
    //     return `${environment.URL_API.dapFoodEndPoint}/thongbao`;
    // }

    get calendarVietnamese(): any {
        return {
            firstDayOfWeek: 0,
            dayNames: [
                'Chủ nhật',
                'Thứ hai',
                'Thứ ba',
                'Thứ tư',
                'Thứ năm',
                'Thứ 6',
                'Thứ 7'
            ],
            dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            monthNames: [
                'Tháng một',
                'Tháng  hai',
                'Tháng ba',
                'Tháng tư',
                'Tháng năm',
                'Tháng sáu',
                'Tháng bảy',
                'Tháng tám',
                'Tháng chín',
                'Tháng mười',
                'Tháng mười một',
                'Tháng mười hai'
            ],
            monthNamesShort: [
                'T1',
                'T2',
                'T3',
                'T4',
                'T5',
                'T6',
                'T7',
                'T8',
                'T9',
                'T10',
                'T11',
                'T12'
            ],
            today: 'Hôm nay',
            clear: 'xóa'
        };
    }

    get authConfig(): AuthConfig {
        return {
            // issuer: environment.authenticationSettings.issuer,
            // clientId: environment.authenticationSettings.clientId,
            redirectUri: window.location.origin,
            silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
            requireHttps: true,
            scope: 'openid profile email',
            showDebugInformation: true,
            sessionChecksEnabled: false,
            requestAccessToken: true
        };
    }
}
