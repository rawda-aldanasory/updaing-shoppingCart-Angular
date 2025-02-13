import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../interfaces/product.interface';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  private subscription = new Subscription();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.subscription.add(
      combineLatest([
        this.productService.getProducts(),
        this.productService.getSearchTerm()
      ]).subscribe(([products, searchTerm]) => {
        this.products = products;
        this.filterProducts(searchTerm);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private filterProducts(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredProducts = this.products;
      return;
    }

    searchTerm = searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
}
