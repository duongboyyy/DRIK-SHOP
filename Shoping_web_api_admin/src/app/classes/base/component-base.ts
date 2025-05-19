import { Subject } from 'rxjs/internal/Subject';
import { Injectable, OnDestroy } from '@angular/core';
import { NotifierService } from '../../services/notifier.service';
import { environment } from '../../../environments/environment';
// import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  
export abstract class ComponentBase implements OnDestroy {

    public _unsubscribeAll: Subject<any>;
    public _notifierService: NotifierService;

    constructor() {
        this._unsubscribeAll = new Subject();
    }

    /**
    * On destroy
    */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getSelectedItemLabel(data, value) {
        const item = data.find(i => i.value === value);
        if (!item) {
            return '';
        }
        return item.label;
    }

    onCopy() {
        this._notifierService.showSuccess('Đã copy !');
    }

    getImage(path: string) {
        return `${environment.PathUrl}/Images/list-image-product/${path}`;
    }

    getImageBlog(path: string) {
        return `${environment.PathUrl}/Images/list-image-blog/${path}`;
    }
    getImageBanner(path: string) {
        return `${environment.PathUrl}/Images/list-image-banner/${path}`;
    }
    getImageCTKM(path: string) {
        return `${environment.PathUrl}/Images/list-image-ctkm/${path}`;
    }
    // urlImageAvatar(path: string) {
    //     if (path == null || path == undefined)
    //         return `/assets/images/no_image.jpg`;
    //     return `${environment.apiDomain.fileEndpoint}/Avatar${path}`;
    // }

    // urlImageMedium(path: string) {
    //     if (path == null || path == undefined)
    //         return `/assets/images/no_image.jpg`;
    //     return `${environment.apiDomain.fileEndpoint}/Medium${path}`;
    // }

    // urlImageLarge(path: string) {
    //     if (path == null || path == undefined)
    //         return `/assets/images/no_image.jpg`;
    //     return `${environment.apiDomain.fileEndpoint}/Large${path}`;
    // }

    // urlImageOriginal(path: string) {
    //     if (path == null || path == undefined)
    //         return `/assets/images/no_image.jpg`;
    //     return `${environment.apiDomain.fileEndpoint}/Original${path}`;
    // }

    // getImageAvatar(id: string) {
    //     if (id == null || id == undefined)
    //         return `/assets/images/no_image.jpg`;
    //     return `${environment.apiDomain.fileEndpoint}/files/image/Avatar/${id}`;
    // }

    // getImageMedium(id: string) {
    //     if (id == null || id == undefined)
    //         return `/assets/images/no_image.jpg`;
    //     return `${environment.apiDomain.fileEndpoint}/files/image/Medium/${id}`;
    // }

    // getImageLarge(id: string) {
    //     if (id == null || id == undefined)
    //         return `/assets/images/no_image.jpg`;
    //     return `${environment.apiDomain.fileEndpoint}/files/image/Large/${id}`;
    // }

    // getImageOriginal(id: string) {
    //     if (id == null || id == undefined)
    //         return `/assets/images/no_image.jpg`;

    //     return `${environment.apiDomain.fileEndpoint}/files/image/Original/${id}`;
    // }

    // getAvatar(id) {
    //     if (id) {
    //         return this.getImageAvatar(id);
    //     }
    //     else {
    //         return `/assets/images/avatar.jpg`;
    //     }
    // }

    GetStatus(item: any) {
        if (item.idStatus === 1000) {
            return `<span class="order don-moi">${item.status}</span>`;
        }
        if (item.idStatus === 31 || item.idStatus === 32) {
            return `<span class="order don-thanhcong">${item.status}</span>`;
        }
        if (item.idStatus === 22 || item.idStatus === 33) {
            return `<span class="order don-nguyhiem">${item.status}</span>`;
        }
        if (item.idStatus === 4 || item.idStatus === 40 || item.idStatus === 41 || item.idStatus === 999) {
            return `<span class="order don-thatbai">${item.status}</span>`;
        } else {
            return `<span class="order don-danggiao">${item.status}</span>`;
        }
    }

    GetActions(item: any) {
        if (!item.idAction) {
            return ``;
        }
        if (item.idAction === 1 || item.idAction === 13) {
            return `<span class="order don-moi">${item.actions}</span>`;
        }
        if (item.idAction === 2 || item.idStatus === 7 || item.idStatus === 3) {
            return `<span class="order don-thanhcong">${item.actions}</span>`;
        }
        if (item.idAction === 4 || item.idStatus === 8) {
            return `<span class="order don-nguyhiem">${item.actions}</span>`;
        }
        if (item.idAction === 5 || item.idStatus === 9 || item.idAction === 14 || item.idAction === 10) {
            return `<span class="order don-thatbai">${item.actions}</span>`;
        }
        else {
            return `<span class="order don-danggiao">${item.actions}</span>`;
        }
    }


}
