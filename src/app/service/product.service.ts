import { StompService } from './stomp.service';
import { HttpClient } from '@angular/common/http';
import { Product } from './../domain/product.domain';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService implements OnDestroy {

    subscription: any;
    constructor(private http: HttpClient, private stompService: StompService) { }

    saveProduct(product: Product): Observable<Product> {
        return this.http.post<Product>('http://localhost:8080/product', product);
    }

    saveProductByWS(product: Product): void {

        if (this.stompService.status === 'CONNECTED') {
            this.stompService.send('/app/save-product', product);
        } else {
            this.subscription = this.stompService.startConnect().then(() => {
                setTimeout(() => {
                    this.stompService.send('/app/save-product', product);
                }, 3000);
            });
        }
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>('http://localhost:8080/products');
    }

    deleteProduct(productId: number): Observable<boolean> {
        return this.http.delete<boolean>('http://localhost:8080/product/' + productId);
    }

    deleteProductByWS(productId: number): void {
        console.dir('Coming here');

        if (this.stompService.status === 'CONNECTED') {
            this.stompService.send('/app/delete-product', productId);
        } else {
            this.subscription = this.stompService.startConnect().then(() => {
                setTimeout(() => {
                    this.stompService.send('/app/delete-product', productId);
                }, 3000);
            });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

    }
}