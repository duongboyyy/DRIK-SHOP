// import { ComponentBase } from './component-base';
// import { Subject } from 'rxjs/internal/Subject';
// import { Output, EventEmitter, OnDestroy, Injector } from '@angular/core';
// import { CommonService } from '../../services/common.service';

// export abstract class PageEditBase extends ComponentBase {
//     isShow     = false;
//     submitting = false;
//     popupId: string;

//     @Output() closePopup = new EventEmitter<any>();

//     constructor(protected _injector: Injector) {
//         super();
//         this.popupId = this._injector.get(CommonService).guid();
//     }

//     async showPopup(data: any = {}) {
//         this.isShow = true;
//         await this.onShowPopup(data);

//         setTimeout(() => {
//             const viewRef = document.getElementById(this.popupId);
//             if (viewRef != null) {
//                 const input = viewRef.querySelector('input');
//                 if (input) {
//                     input.focus();
//                 } else {
//                     const texateara = viewRef.querySelector('textarea');

//                     if (texateara) {
//                         texateara.focus();
//                     }
//                 }
//             }
//         }, 500);
//     }

//     onShowPopup(data: any) {

//     }

//     closePopupMethod(data: any) {
//         this.isShow = false;
//         this.closePopup.next(data);
//     }

//     getMaxWidthDialog() {
//         return (window.innerHeight - 200).toString() + 'px';
//     }
// }
