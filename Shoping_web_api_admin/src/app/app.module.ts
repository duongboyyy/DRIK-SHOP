import { CommonModule, DatePipe } from '@angular/common';
import { NotifierModule } from 'angular-notifier';
import { KonvaModule } from 'ng2-konva';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSortModule } from '@angular/material/sort';
import { LayoutModule } from '@angular/cdk/layout';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './admin/containers';
import { P404Component } from './admin/containers/views/error/404.component';
import { P500Component } from './admin/containers/views/error/500.component';
import { LoginComponent } from './admin/containers/views/account/login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
// Import routing module
import { AppRoutingModule } from './app.routing';
// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { OrdersTableComponent } from './admin/containers/orders-table/orders-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RegistrationFormComponent } from './admin/containers/views/account/registration-form/registration-form.component';
import { UserService } from './admin/containers/views/account/user.service';
import { UserdetailComponent } from './admin/containers/userdetail/userdetail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrandsComponent } from './admin/containers/views/brands/brands.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MauSacsComponent } from './admin/containers/views/mau-sacs/mau-sacs.component';
import { SizesComponent } from './admin/containers/views/sizes/sizes.component';
import { CategoryService } from './admin/containers/views/categories/category.service';
import { CategoryComponent } from './admin/containers/views/categories/category/category.component';
import { HoaDonsComponent } from './admin/containers/views/hoa-dons/hoa-dons.component';
import { AspNetUsersComponent } from './admin/containers/views/asp-net-users/asp-net-users.component';
import { BrandComponent } from './admin/containers/views/brands/brand/brand.component';
import { ProductsComponent } from './admin/containers/views/products/products.component';
import { ProductComponent } from './admin/containers/views/products/product/product.component';
import { ImagesmodelComponent } from './admin/containers/views/products/imagesmodel/imagesmodel.component';
import { CategoriesComponent } from './admin/containers/views/categories/categories.component';
import { SizeComponent } from './admin/containers/views/sizes/size/size.component';
import { MauSacComponent } from './admin/containers/views/mau-sacs/mau-sac/mau-sac.component';
import { AuthGuard } from './admin/containers/views/auth.guard';
import { ModalComponent } from './admin/containers/modal/modal.component';
import { SanPhamBienTheComponent } from './admin/containers/views/san-pham-bien-thes/san-pham-bien-the/san-pham-bien-thecomponent';
import { SanPhamBienThesComponent } from './admin/containers/views/san-pham-bien-thes/san-pham-bien-thes.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HoaDonComponent } from './admin/containers/views/hoa-dons/hoa-don/hoa-don.component';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './admin/containers/views/profile/profile.component';
import { DashboardComponent } from './admin/containers/views/dashboard/dashboard.component';
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { FusionChartsModule } from 'angular-fusioncharts';
import { SelectMonthComponent } from './admin/containers/views/chart-second/select-month/select-month.component';
import { ChartSecondComponent } from './admin/containers/views/chart-second/chart-second.component';
import { DiscoutCodesComponent } from './admin/containers/views/discout-codes/discout-codes.component';
import { DiscoutCodeComponent } from './admin/containers/views/discout-codes/discout-code/discout-code.component';
import { TaoPhieuNhapsComponent } from './admin/containers/views/tao-phieu-nhaps/tao-phieu-nhaps.component';
import { TaoPhieuNhapComponent } from './admin/containers/views/tao-phieu-nhaps/tao-phieu-nhap/tao-phieu-nhap.component';
import { NhaCungCapsComponent } from './admin/containers/views/nhacungcaps/nhacungcaps.component';
import { NhaCungCapComponent } from './admin/containers/views/nhacungcaps/nhacungcap/nhacungcap.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
// import { TaoPhieuNhapSuccessComponent } from './admin/containers/views/tao-phieu-nhaps/tao-phieu-nhap-success/tao-phieu-nhap-success.component';
import { TaoPhieuNhapDetailComponent } from './admin/containers/views/tao-phieu-nhaps/tao-phieu-nhap-detail/tao-phieu-nhap-detail.component';
import { ChartThirdComponent } from './admin/containers/views/chart-third/chart-third.component';
import { HoaDonEditComponent } from './admin/containers/views/hoa-dons/hoa-don-edit/hoa-don-edit.component';
// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
// data-visualization
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';
import { ChatsComponent } from './admin/containers/views/chats/chats.component';
import { BlogsComponent } from './admin/containers/views/blogs/blogs.component';
import { BlogComponent } from './admin/containers/views/blogs/blog/blog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MultiTranslateHttpLoader } from './classes/multi-translate-http-loader';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { ProductEditComponent } from './admin/containers/views/products/product-edit/product-edit.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CategoryEditComponent } from './admin/containers/views/categories/category-edit/category-edit.component';
import { SupplierEditComponent } from './admin/containers/views/nhacungcaps/supplier-edit/supplier-edit.component';
import { BrandEditComponent } from './admin/containers/views/brands/brand-edit/brand-edit.component';
import { DiscoutEditComponent } from './admin/containers/views/discout-codes/discout-edit/discout-edit.component';
import { HqNumberPipe } from './pipes/number.pipe';
import { SizeEditComponent } from './admin/containers/views/sizes/size-edit/size-edit.component';
import { ColorEditComponent } from './admin/containers/views/mau-sacs/color-edit/color-edit.component';
import { SanPhamBienTheEditComponent } from './admin/containers/views/san-pham-bien-thes/san-pham-bien-the-edit/san-pham-bien-the-edit.component';
import {EditorModule} from 'primeng/editor'
import { BlogEditComponent } from './admin/containers/views/blogs/blog-edit/blog-edit.component';
import { BannersComponent } from './admin/containers/views/banners/banners.component';
import { BannerEditComponent } from './admin/containers/views/banners/banner-edit/banner-edit.component';
import { RolesComponent } from './admin/containers/views/role/roles.component';
import { RoleEditComponent } from './admin/containers/views/role/role-edit/role-edit.component';
import { CalendarModule } from 'primeng/calendar';
import { UserEditComponent } from './admin/containers/views/asp-net-users/user-edit/user-edit.component';
import { UserRoleComponent } from './admin/containers/views/asp-net-users/user-role/user-role.component';
import { PickListModule } from 'primeng/picklist';
import { CtkmsComponent } from './admin/containers/views/ctkms/ctkms.component';
import { CtkmsEditComponent } from './admin/containers/views/ctkms/ctkms-edit/ctkms-edit.component';
import { CheckboxModule } from 'primeng/checkbox';
import { WarehouseComponent } from './admin/containers/views/warehouse/warehouse.component';
import { WarehouseEditComponent } from './admin/containers/views/warehouse/warehouse-edit/warehouse-edit.component';
import { WarehouseproductComponent } from './admin/containers/views/warehouseproduct/warehouseproduct.component';
import { WarehouseproductEditComponent } from './admin/containers/views/warehouseproduct/warehouseproduct-edit/warehouseproduct-edit.component';
import { DropdownModule } from 'primeng/dropdown'; 
import { ThongKeDonHangComponent } from './admin/containers/views/thong-ke-don-hang/thong-ke-don-hang.component';
import { BaoCaoTongHopTheoNccComponent } from './admin/containers/views/bao-cao-tong-hop-theo-ncc/bao-cao-tong-hop-theo-ncc.component';
import { BaoCaoTonKhoCuaHangComponent } from './admin/containers/views/bao-cao-ton-kho-cua-hang/bao-cao-ton-kho-cua-hang.component';
//import { DropdownModule   } from 'primeng/dropdown';
import { HoaDonEditMultipleComponent } from './admin/containers/views/hoa-dons/hoa-don-edit-multiple/hoa-don-edit-multiple.component';
import { CuaHangsComponent } from './admin/containers/views/cua-hangs/cua-hangs.component';
import { CuaHangEditComponent } from './admin/containers/views/cua-hangs/cua-hang-edit/cua-hang-edit.component';
import { CuaHangEditMultipleComponent } from './admin/containers/views/cua-hangs/cua-hang-edit-multiple/cua-hang-edit-multiple.component';
import { HoaDonAddComponent } from './admin/containers/views/hoa-dons/hoa-don-add/hoa-don-add.component';
import { CtkmsConfigComponent } from './admin/containers/views/ctkms/ctkms-config/ctkms-config.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
      { prefix: './assets/i18n/', suffix: '.json' },
      { prefix: './assets/i18n/shared/', suffix: '.json' }
  ]);
}


FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);
@NgModule({
  imports: [
    TableModule,
    HttpClientModule,
    FusionChartsModule,
    KonvaModule,
    ChartsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    NgxPaginationModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    IconModule,
    IconSetModule.forRoot(),
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    MatDialogModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ColorPickerModule,
    TooltipModule,
    ButtonModule,
    SelectButtonModule,
    DialogModule,
    InputTextModule,
    EditorModule,
    CalendarModule,
    PickListModule,
    DropdownModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  }),
    ToastrModule.forRoot({
      timeOut: 1000,
      progressBar: true,
      progressAnimation: 'increasing'
    }
    ),
    BrowserAnimationsModule,
    //
    NotifierModule,
    MatDatepickerModule,
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    DropdownModule,
    ToggleButtonModule,
    CheckboxModule,
  ],
  declarations: [
    DashboardComponent,
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    OrdersTableComponent,
    UserdetailComponent,
    BrandsComponent,
    MauSacsComponent,
    MauSacComponent,
    SizesComponent,
    CategoryComponent,
    HoaDonsComponent,
    AspNetUsersComponent,
    BrandComponent,
    ProductsComponent,
    ProductComponent,
    RegistrationFormComponent,
    ImagesmodelComponent,
    CategoriesComponent,
    SizeComponent,
    MauSacComponent,
    SanPhamBienTheComponent,
    SanPhamBienThesComponent,
    ModalComponent,
    ProfileComponent,
    HoaDonComponent,
    DefaultLayoutComponent,
    SelectMonthComponent,
    ChartSecondComponent,
    NhaCungCapComponent,
    NhaCungCapsComponent,
    DiscoutCodesComponent,
    DiscoutCodeComponent,
    TaoPhieuNhapsComponent,
    TaoPhieuNhapComponent,
    // TaoPhieuNhapSuccessComponent,
    TaoPhieuNhapDetailComponent,
    ChartThirdComponent,
    HoaDonEditComponent,
    ChatsComponent,
    BlogsComponent,
    BlogComponent,
    ProductEditComponent,
    CategoryEditComponent,
    SupplierEditComponent,
    BrandEditComponent,
    DiscoutEditComponent,
    HqNumberPipe,
    SizeEditComponent,
    ColorEditComponent,
    BlogEditComponent,
    BannersComponent,
    BannerEditComponent,
    SanPhamBienTheEditComponent,
    RolesComponent,
    RoleEditComponent,
    UserEditComponent,
    UserRoleComponent,
    CtkmsComponent,
    CtkmsEditComponent,
    ThongKeDonHangComponent,
    WarehouseComponent,
    WarehouseEditComponent,
    WarehouseComponent,
    WarehouseproductComponent,
    WarehouseproductEditComponent,
    BaoCaoTongHopTheoNccComponent,
    BaoCaoTonKhoCuaHangComponent,
    HoaDonEditMultipleComponent,
    CuaHangsComponent,
    CuaHangEditComponent,
    CuaHangEditMultipleComponent,
    HoaDonAddComponent,
    CtkmsConfigComponent,
  ],
  providers: [
    TranslateService,
    IconSetService,
    UserService,
    [AuthGuard],
    LoginComponent,
    DatePipe,
    MessageService,
    ConfirmationService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
