import { StompService } from './../../service/stomp.service';
import { Product } from './../../domain/product.domain';
import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss']
})
export class AdminComponent implements OnInit {

    products: Product[];
    selectedProduct: Product;
    subscription: any[] = [];
    private wsConf = {
        host: `http://localhost:8080/ws`,
        debug: false,
    };
    constructor(private productService: ProductService, private stompService: StompService) { }

    ngOnInit() {
        this.getAllProducts();
        this.subscribe();
    }

    onSelectedProduct(product: Product) {
        this.selectedProduct = product;
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
                .subscribe(`/topic/new-product`, this.response));
            this.subscription.push(this.stompService
                .subscribe(`/topic/delete-product`, this.deleteProduct));
        } else {
            this.stompService.configure(this.wsConf);
            this.stompService.startConnect().then(() => {
                setTimeout(() => {
                    this.subscription.push(this.stompService
                        .subscribe(`/topic/new-product`, this.response));
                    this.subscription.push(this.stompService
                        .subscribe(`/topic/delete-product`, this.deleteProductResponse));
                }, 3000);
            });
        }
    }

    response = (data) => {
        this.products.unshift(data);
        this.selectedProduct = this.products.find(p => p.id === data.id);
    }
    deleteProductResponse = (data) => {
        this.products = this.products.filter( p => p.id !== data);
        this.selectedProduct = this.products[0];
    }

    saveProduct(product: Product) {

        product = new Product();
        product.name = 'New Product';
        product.code = 'SE34TY';
        product.price = '12.32';

        this.productService.saveProduct(product).subscribe(savedProduct => {
            console.dir(savedProduct);
            this.products.unshift(savedProduct);
            this.selectedProduct = this.products.find(p => p.id === savedProduct.id);
        });
    }

    saveProductByWS(product: Product) {

        product = new Product();
        product.name = 'New Product WebSocket';
        product.code = 'SE34TY';
        product.price = '12.32';

        this.productService.saveProductByWS(product);
    }

    deleteProduct(product: Product) {
        this.productService.deleteProduct(product.id).subscribe(isDeleted => {
            this.products = this.products.filter(p => p.id !== product.id);
        });
    }

    deleteProductByWS(product: Product) {
        this.productService.deleteProductByWS(product.id);
    }

    editProduct(product: Product) {

    }

    editProductByWS(product: Product) {

    }
}
