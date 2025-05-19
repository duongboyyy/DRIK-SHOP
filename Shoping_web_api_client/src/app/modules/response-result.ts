export interface ResponseResult {
    message: string;
    error: string;
    data: any;
    dataTotal: any;
    totalRecord: number;
    metadata?: any;
    totalCount?: number;
    status?: number;
    success?: boolean;
}

export class ResponsePagination<T> {
    metadata: Meta;
    data: T;
}

export class Meta {
    totalRecord = 0;
    currentPage = 0;
    totalPage = 0;
    pageSize = 20;
}
