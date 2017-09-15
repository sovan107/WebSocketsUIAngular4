import { Product } from './../../domain/product.domain';
import { ProductService } from './../../service/product.service';
import { Component } from '@angular/core';

@Component({
    selector: 'admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss']
})
export class AdminComponent {

    constructor(private productService: ProductService) { }

    saveProduct(product: Product) {

        product = new Product();
        product.name = 'New Product';
        product.code = 'SE34TY';
        product.price = '12.32';

        this.productService.saveProduct(product).subscribe(savedProduct => {
            console.dir(savedProduct);
        });
    }

    saveProductByWS(product: Product) {
        this.productService.saveProductByWS(product).subscribe(savedProduct => {
            console.dir(savedProduct);
        });
    }


    listProduct() {
        this.productService.getProducts().subscribe(products => {
            console.dir(products);
        });
    }
}
