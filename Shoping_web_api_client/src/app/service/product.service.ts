import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { take, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  itemsSubject = new BehaviorSubject<Product[]>([]);
  items$ = this.itemsSubject.asObservable();
  itemsSubject1 = new BehaviorSubject<Product[]>([]);
  items1$ = this.itemsSubject1.asObservable();

  constructor(private http: HttpClient) {

    let existingCartItems = JSON.parse(localStorage.getItem('products'));
    if (!existingCartItems) {
      existingCartItems = [];
    }
    this.itemsSubject.next(existingCartItems);

    let existingCartItems1 = JSON.parse(localStorage.getItem('loves'));
    if (!existingCartItems1) {
      existingCartItems1 = [];
    }
    this.itemsSubject1.next(existingCartItems1);

    const userId = localStorage.getItem('idUser');
    if (userId) {
      this.http.post(environment.URL_API + "Carts/getCart/" + userId, {}).subscribe(
        (res: Product[]) => {
          const listItem: Product[] = res;
          localStorage.setItem('products', JSON.stringify(listItem));
          this.itemsSubject.next(listItem);
        }
      );
    }
  }

  addToCart(product: Product) {
    const userId = localStorage.getItem('idUser');
    if (userId) {
      this.items$.pipe(
        take(1),
        map((products) => {
          products.push(product);
          localStorage.setItem('products', JSON.stringify(products));
          this.itemsSubject.next(products);
        })
      ).subscribe();
    }
  }

  addToLove(product: Product) {
    const userId = localStorage.getItem('idUser');
    if (userId) {
      this.items1$.pipe(
        take(1),
        map((products) => {
          products.push(product);
          localStorage.setItem('loves', JSON.stringify(products));
          this.itemsSubject1.next(products);
        })
      ).subscribe();
    }
  }

  DeleteProduct(product: Product) {
    const userId = localStorage.getItem('idUser');
    if (userId) {
      this.items$.pipe(
        take(1),
        map((products) => {
          const index = products.indexOf(product);
          if (index > -1) {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            this.itemsSubject.next(products);
          }
        })
      ).subscribe();
    }
  }

  DeleteProductInLove(product: Product) {
    const userId = localStorage.getItem('idUser');
    if (userId) {
      this.items1$.pipe(
        take(1),
        map((products) => {
          const index = products.indexOf(product);
          if (index > -1) {
            products.splice(index, 1);
            localStorage.setItem('loves', JSON.stringify(products));
            this.itemsSubject1.next(products);
          }
        })
      ).subscribe();
    }
  }

  LoadCart() {
    const userId = localStorage.getItem('idUser');
    if (userId) {
      this.http.post(environment.URL_API + "Carts/getCart/" + userId, {}).subscribe(
        (res: Product[]) => {
          const listItem: Product[] = res;
          localStorage.setItem('products', JSON.stringify(listItem));
          this.itemsSubject.next(listItem);
        }
      );
    }
  }
}
