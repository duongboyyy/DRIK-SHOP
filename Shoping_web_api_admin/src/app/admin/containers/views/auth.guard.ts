import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './account/user.service';
import { ToastServiceService } from '../shared/toast-service.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public toast: ToastServiceService,private user: UserService,private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userRoles = JSON.parse(localStorage.getItem('quyen') || '[]'); // ['Admin'], ['Warehouse'], etc.
    const url = state.url;
  
    if (this.user.isLoggedIn()) {
      const isAdmin = userRoles.includes('Admin');
  
      // ✅ Nếu là Admin thì cho vào tất cả
      if (isAdmin) {
        return true;
      }
  
      // ✅ Danh sách route theo từng quyền
      const roleRoutes: { [role: string]: string[] } = {
        Warehouse: ['/admin/hoadons','/admin/thong-ke-so-luong-don-hang','/admin/chartthird','/admin/chartsecond','/admin/dashboard','/admin/warehouse','/admin/warehouseproduct'],
        Employee:['/admin/products',
          '/admin/categories',
          '/admin/nhacungcaps',
          '/admin/sizes',
          '/admin/brands',
          '/admin/mausacs',
          '/admin/sanphambienthes',
          '/admin/blogs',
          '/admin/banners',
          '/admin/taophieunhap',
          '/admin/hoadons',
          '/admin/warehouse',
          '/admin/warehouseproduct'],
        // có thể thêm: Manager: ['/admin/manager'], ...
      };
  
      // ✅ Kiểm tra xem có role nào được phép vào route này không
      const hasPermission = userRoles.some(role =>
        roleRoutes[role]?.includes(url)
      );
  
      if (hasPermission) {
        return true;
      } else {
        this.toast.showToastQuyen(); // Không đủ quyền
        return false;
      }
    }
  
    // ❌ Chưa đăng nhập → chuyển về login
    this.router.navigate(['/login']);
    return false;
  }
}