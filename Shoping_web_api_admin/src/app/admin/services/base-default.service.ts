import { Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { retry } from 'rxjs/internal/operators/retry';
import { catchError } from 'rxjs/internal/operators/catchError'; 
import { ResponseResult } from '../modules/response-result';

export abstract class BaseDefaultService {
    _http: HttpClient;
    _injector: Injector;

    serviceUri = '';

    readonly RETRY_COUNT: number = 0;
    readonly REPLAY_COUNT: number = 1;
    readonly LIMIT_DEFAULT: number = 1000;

    constructor(
        http: HttpClient
        , injector: Injector
        , serviceUri: string
    ) {
        this._http = http;
        this._injector = injector;
        this.serviceUri = serviceUri;
    }

    // Gets(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {

    //     let queryString = `?key=${key}`;

    //     if (!offset) {
    //         offset = 0;
    //     }

    //     queryString += `&offset=${offset}`;


    //     if (!limit) {
    //         limit = this.LIMIT_DEFAULT;
    //     }
    //     queryString += `&limit=${limit}`;


    //     if (sortField) {
    //         queryString += `&sortField=${sortField}&isAsc=${isAsc}`;
    //     }

    //     const apiUrl = `${this.serviceUri}${queryString}`;

    //     // if (isIgnoreCache) {
    //     //     return this.getIgnoreClientCache(apiUrl);
    //     // }
    //     return this.defaultGet(apiUrl);
    // 
    
    getDetail(id: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/${id}`;
        return this.defaultGet(url);
    }
    getDetailhoadon(id: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/admindetailorder/${id}`;
        return this.defaultGet(url);
    }

    post(item: any): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(this.serviceUri, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }

    put(id: string, item: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/${id}`;

        return this._http
            .put<ResponseResult>(url, item).toPromise();
    }

    delete(id: number): Promise<ResponseResult> {
        const url = `${this.serviceUri}/${id}`;
        return this._http
            .delete<ResponseResult>(url)
            .pipe(retry(this.RETRY_COUNT)).toPromise();
    }
    deletestring(id: string): Promise<ResponseResult> {
        const url = `${this.serviceUri}/${id}`;
        return this._http
            .delete<ResponseResult>(url)
            .pipe(retry(this.RETRY_COUNT)).toPromise();
    }

    deleteMany(lstId: string): Promise<ResponseResult> {
        const url = `${this.serviceUri}/DeleteMany/${lstId}`;
        return this._http
            .delete<ResponseResult>(url)
            .pipe(retry(this.RETRY_COUNT)).toPromise();
    }

    defaultGet(apiUrl): Promise<ResponseResult> {
        return this._http.get<ResponseResult>(apiUrl)
            .pipe(
                shareReplay(this.REPLAY_COUNT),
                retry(this.RETRY_COUNT),
                catchError((err: HttpErrorResponse) => this.handleError(err, this._injector))
            ).toPromise();
    }
    defaultPost(apiUrl, item): Promise<ResponseResult> {
        return this._http
            .post<ResponseResult>(apiUrl, item)
            .pipe(catchError(err => this.handleError(err, this._injector))).toPromise();
    }
    defaultDelete(apiUrl): Promise<ResponseResult> {
        return this._http
            .delete<ResponseResult>(apiUrl)
            .pipe(retry(this.RETRY_COUNT)).toPromise();
    }


    getIgnoreClientCache(apiUrl): Promise<ResponseResult> {

        const options = {
            headers: new HttpHeaders({ 'Cache-Control': 'no-cache' }),
        };

        return this._http.get<ResponseResult>(apiUrl, options)
            .pipe(
                shareReplay(this.REPLAY_COUNT),
                retry(this.RETRY_COUNT),
                catchError((err: HttpErrorResponse) => this.handleError(err, this._injector))
            ).toPromise();
    }

    handleError(error: any, injector: Injector) {
        // console.error('Có lỗi xảy ra', error);
        if (error.status === 401 || error.status == 403) {
            error.message = `Bạn không có quyền truy cập (${error.status})`;
            // const authenService = injector.get(VsAuthenService);
            // authenService.logout();
        } else {
            error.message = `${error.message} (${error.status})`;
        }
        return Promise.reject(error);
    }
}
