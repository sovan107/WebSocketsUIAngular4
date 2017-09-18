import { Product } from './../../domain/product.domain';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'product-detail',
    templateUrl: 'product-detail.component.html',
    styleUrls: ['product-detail.component.scss']
})
export class ProductDetailComponent implements OnChanges {

    @Input() selectedProduct: Product;

    ngOnChanges(changes: SimpleChanges) {
        if (this.selectedProduct) {
            console.dir(this.selectedProduct);
        }
    }

    save() {

    }

    cancel() {

    }

}
