import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hqnumber' })
export class HqNumberPipe implements PipeTransform {
    transform(value: any, decimal: number = 2): string {
        // Nếu giá trị là null hoặc không xác định, trả về giá trị ban đầu
        if (value == null) return value;

        // Chuyển đổi giá trị thành số và định dạng với số chữ số thập phân quy định
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return value; // Kiểm tra nếu giá trị không phải là số hợp lệ
        
        const formattedValue = numValue.toFixed(decimal);
        const parts = formattedValue.split('.');

        // Định dạng phần nguyên của số
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        // Nếu có phần thập phân
        if (parts.length > 1) {
            return `${integerPart},${parts[1]}`;
        } else {
            return integerPart;
        }
    }
}
