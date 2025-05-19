import { Component, Injector, OnInit } from '@angular/core';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { Utilities } from '../../../shared/utilities';
import { UserRoleService } from '../user-role.service';
// import { AppRolesService } from '../../services/approles.service';
// import { UserService } from '../../lib-shared/services/user.service';

@Component({
    selector: 'app-user-role',
    templateUrl: './user-role.component.html',
    styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent extends SecondPageEditBase implements OnInit {
    isLoading = false;
    isSaving = false;
    unassignedRoles: any[] = [];
    assignedRoles: any[] = [];
    item: any;
    header = '';
    pickListSource: any[];
    pickListTarget: any[];
    constructor(
        protected _injector: Injector,
        private _vaiTroService: UserRoleService,
        // private _UserService: UserService
    ) {
        super(null, _injector);
    }

    async ngOnInit() {

    }

    async loadOptions() {
    }

    save() {
        this.isSaving = true;
    
        const roleIds = this.pickListTarget.map(role => role.roleId);
    
        const payload = {
            userId: this.item.id,
            roleIds: roleIds
        };
    
        console.log("Dữ liệu gửi lên API:", payload);
    
        this._vaiTroService.Save(payload).subscribe({
            next: (response) => {
                this._notifierService.showSuccess("Gán quyền thành công!");
                this.reset();
                this.isShow = false;
                this.closePopupMethod(response.data);
            },
            error: (error) => {
                this.isSaving = false;
                this._notifierService.showError(Utilities.getErrorDescription(error));
            }
        });
    }
    

    async showPopup(item: any) {
        this.isShow = true;
        this.loadOptions();

        if (item) {
            this.item = item;
            this.header = `Gán vai trò người dùng: ${item.firstName ?? ''} ${item.lastName ?? ''}`;
            this.isLoading = true;
            const roles = this._vaiTroService.Gets('', 0, 9999);
            const userRoles = this._vaiTroService.getUserRoles(this.item.id);
            Promise.all([roles, userRoles]).then((re) => {
                this.isLoading = false;
                // this.unassignedRoles = re[0].data;

                this.unassignedRoles = re[0].data.map(role => ({
                    roleId: role.id,  
                    roleName: role.name
                }));
                
                this.assignedRoles = re[1].data.map(role => ({
                    roleId: role.roleId,  
                    roleName: role.roleName
                }));

                this.pickListSource = this.unassignedRoles.filter(role => 
                    !this.assignedRoles.some(assigned => assigned.roleId === role.roleId)
                );
    
                this.pickListTarget = [...this.assignedRoles];

            }).catch(error => {
                this.isLoading = false;
                this._notifierService.showError(Utilities.getErrorDescription(error));
            });
            
        }

    }

    onAssigne(item: any) {
        //console.log('Danh sách Vai trò đã gán:', this.pickListTarget);
    }

    reset() {
        this.item = null;
        this.isLoading = false;
        this.isSaving = false;
        this.unassignedRoles = [];
        this.assignedRoles = [];
    }

    cancel() {
        this.reset();
    }

    closePopupMethod(data: any) {
        this.reset();
        super.closePopupMethod(data);
    }
}
