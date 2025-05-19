import { INavData } from '@coreui/angular';
export const navItems: INavData[] = [
  {
    name:"THỐNG KÊ",
    children:
    [
      {
        name: 'Tổng quan',
        url: '/admin/dashboard',
        icon: 'cil-chart-line',
      },
      {
        name: 'Bán hàng',
        url: '/admin/chartsecond',
        icon: 'cil-chart-pie',
      },
      {
        name: 'Nhập hàng',
        url: '/admin/chartthird',
        icon: 'cil-bar-chart',
      },
      {
        name: 'Thống kê số lượng đơn hàng',
        url: '/admin/thong-ke-so-luong-don-hang',
        icon: 'cil-chart-pie',
      },

      {
        name: 'Báo cáo doanh số theo nhà cung cấp',
        url: '/admin/bao-cao-doanh-so-theo-ncc',
        icon: 'cil-chart-pie',
      },
      {
        name: 'Báo cáo tồn kho',
        url: '/admin/bao-cao-ton-kho',
        icon: 'cil-chart-pie',
      },
      
    ]
  },
  {
    name:"QUẢN LÝ",
    children:
    [
      {
        name: 'Thiết lập sản phẩm',
        url: '/admin/products',
        icon: 'cil-3d',
      },
      {
        name: 'Danh mục',
        url: '/admin/categories',
        icon: 'cil-aperture',
      },
      {
        name: 'Nhà cung cấp',
        url: '/admin/nhacungcaps',
        icon: 'cil-library-building',
      },
      {
        name: 'Nhãn hiệu',
        url: '/admin/brands',
        icon: 'cil-apps',
      },
      {
        name: 'Size',
        url: '/admin/sizes',
        icon: 'cil-resize-width',
      },
      {
        name: 'Màu sắc',
        url: '/admin/mausacs',
        icon: 'cil-burn',
      },
      {
        name: 'Sản phẩm biến thể',
        url: '/admin/sanphambienthes',
        icon:'cil-dialpad'
      },
      {
        name:'Người dùng',
        url:'/admin/users',
        icon:'cil-address-book'
      },
      {
        name: 'Mã giảm giá',
        url: '/admin/magiamgias',
        icon: 'cil-puzzle',
      },
      {
        name: 'Chương trình khuyến mại',
        url: '/admin/ctkms',
        icon: 'cil-puzzle',
      },
      {
        name:'Blog',
        url:'admin/blogs',
        icon:'cil-clipboard'
      },
      {
        name:'Banner',
        url:'admin/banners',
        icon:'cil-image'
      },
      // {
      //   name:'Trò chuyện',
      //   url:'admin/chats',
      //   icon:'cil-chat-bubble'
      // },
      {
        name:'Role',
        url:'admin/roles',
        icon:'cil-at'
      },
      
    ]
  },
  {
    name:"HÓA ĐƠN",
    children:
    [
      {
        name: 'Hóa đơn bán hàng',
        url: '/admin/hoadons',   
        icon:'cil-notes'
      },
      // {
      //   name: 'Hóa đơn cửa hàng',
      //   url: '/admin/store',   
      //   icon:'cil-notes'
      // },
      {
        name:'Phiếu nhập hàng',
        url:'admin/taophieunhap',
        icon:'cil-list-rich'
      },
      
    ]
  },
  {
    name:"KHO",
    children:
    [
      {
        name: 'Quản lý kho',
        url: '/admin/warehouse',   
        icon:'cil-notes'
      },
      {
        name:'Quản lý sản phẩm kho',
        url:'admin/warehouseproduct',
        icon:'cil-list-rich'
      },
    ]
  },
];

export const navItemsEmployee: INavData[] = [
  {
    name:"QUẢN LÝ",
    children:
    [
      {
        name: 'Thiết lập sản phẩm',
        url: '/admin/products',
        icon: 'cil-3d',
      },
      {
        name: 'Danh mục',
        url: '/admin/categories',
        icon: 'cil-aperture',
      },
      {
        name: 'Nhà cung cấp',
        url: '/admin/nhacungcaps',
        icon: 'cil-library-building',
      },
      {
        name: 'Nhãn hiệu',
        url: '/admin/brands',
        icon: 'cil-apps',
      },
      {
        name: 'Size',
        url: '/admin/sizes',
        icon: 'cil-resize-width',
      },
      {
        name: 'Màu sắc',
        url: '/admin/mausacs',
        icon: 'cil-burn',
      },
      {
        name: 'Sản phẩm biến thể',
        url: '/admin/sanphambienthes',
        icon:'cil-dialpad'
      },
      
      
      {
        name:'Blog',
        url:'admin/blogs',
        icon:'cil-clipboard'
      },
      {
        name:'Banner',
        url:'admin/banners',
        icon:'cil-image'
      },
      
      
    ]
  },
  {
    name:"HÓA ĐƠN",
    children:
    [
      {
        name: 'Hóa đơn bán hàng',
        url: '/admin/hoadons',   
        icon:'cil-notes'
      },
      
      {
        name:'Phiếu nhập hàng',
        url:'admin/taophieunhap',
        icon:'cil-list-rich'
      },
      
    ]
  },
  {
    name:"KHO",
    children:
    [
      {
        name: 'Quản lý kho',
        url: '/admin/warehouse',   
        icon:'cil-notes'
      },
      {
        name:'Quản lý sản phẩm kho',
        url:'admin/warehouseproduct',
        icon:'cil-list-rich'
      },
    ]
  },
];
