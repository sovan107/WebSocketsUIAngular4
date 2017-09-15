import { StompService } from './stomp.service';
import { HttpClient } from '@angular/common/http';
import { Product } from './../domain/product.domain';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductService {

    constructor(private http: HttpClient, private stompService: StompService) { }

    saveProduct(product: Product): Observable<Product> {
        return this.http.post<Product>('http://localhost:8080/product', product);
    }

    saveProductByWS(product: Product): void {
        console.dir('called');
        return this.stompService.send('/app/save-product', product);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>('http://localhost:8080/products');
    }
}