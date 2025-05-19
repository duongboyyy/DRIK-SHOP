import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CustomRouterService {

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {

    }

    openChildPage(childPageRouter: string, navExtra: NavigationExtras = {}) {
        this._router.navigate([childPageRouter], navExtra);
    }

    openPage(pageRouter: string, navExtra: NavigationExtras = {}) {
        this._router.navigate([pageRouter], navExtra);
    }

    backToParentPage() {
        this._router.navigate(['..'], { relativeTo: this._activatedRoute });
    }

    openCreatePage(navExtra: NavigationExtras = {}) {
        this._router.navigate(['./create'], navExtra);
    }

    openEditPage(id: string, navExtra: NavigationExtras = {}) {
        this._router.navigate([`./edit/${id}`], navExtra);
    }

    parseFragment(fragmentString: string): any {
        if (!fragmentString || fragmentString === '') {
            return {};
        }

        const urlSearchParam = fragmentString.split('&');
        const obj = {};
        for (const index in urlSearchParam) {
            const item = urlSearchParam[index].split('=');
            obj[item[0]] = item[1];
        }
        return obj;
    }

    getUrlWithoutParamAndFragment() {

    }
}
