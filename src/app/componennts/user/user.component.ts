import { Product } from './../../domain/product.domain';
import { ProductService } from './../../service/product.service';
import { StompService } from './../../service/stomp.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'user',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

    private subscription: any[] = [];
    products: Product[];
    selectedProduct: Product;
    private wsConf = {
        host: `http://localhost:8080/ws`,
        debug: false,
    };
    constructor(private stompService: StompService, private productService: ProductService) { }

    ngOnInit() {
        this.subscribe();
        this.getAllProducts();
    }

    getAllProducts() {
        this.productService.getProducts().subscribe(products => {
            this.products = products;
            this.selectedProduct = this.products[0];
        });
    }

    subscribe() {
        if (this.stompService.status === 'CONNECTED') {
            this.subscription.push(this.stompService
                .subscribe(`/topic/new-product`, this.newProduct));
            this.subscription.push(this.stompService
                .subscribe(`/topic/delete-product`, this.deleteProduct));
        } else {
            this.stompService.configure(this.wsConf);
            this.stompService.startConnect().then(() => {
                setTimeout(() => {
                    this.subscription.push(this.stompService
                        .subscribe(`/topic/new-product`, this.newProduct));
                    this.subscription.push(this.stompService
                        .subscribe(`/topic/delete-product`, this.deleteProduct));
                }, 3000);
            });
        }
    }

    onSelect(product: Product) {
        this.selectedProduct = product;
    }

    newProduct = (data) => {
        this.products.unshift(data);
        this.selectedProduct = this.products.find(p => p.id === data.id);
    }
    deleteProduct = (data) => {
        this.products = this.products.filter(p => p.id !== data);
        this.selectedProduct = this.products[0];
    }

    ngOnDestroy() {
        this.subscription.forEach(sub => sub.unsubscribe());
    }
}
