import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../service/product.service';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .back-button {
      padding: 0.5rem 1rem;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 2rem;
    }

    .back-button:hover {
      background-color: #e9ecef;
    }

    .product-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .product-image img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }

    .product-info {
      padding: 1rem;
    }

    h1 {
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    .description {
      color: #6c757d;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #212529;
      margin-bottom: 1rem;
    }

    .stock {
      font-weight: 500;
      margin: 8px 0;
    }
    
    .out-of-stock {
      color: #dc3545;
    }
    
    .low-stock {
      color: #ffc107;
    }
    
    .in-stock {
      color: #28a745;
    }

    @media (max-width: 768px) {
      .product-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.productService.getProducts().subscribe(products => {
        this.product = products.find(p => p.id === id);
        if (!this.product) {
          this.router.navigate(['/']);
        }
      });
    });
  }

  getStockMessage(): string {
    if (!this.product) return '';
    
    if (this.product.quantity === 0) {
      return 'Out of Stock';
    } else if (this.product.quantity <= 3) {
      return `Only ${this.product.quantity} left!`;
    } else {
      return `Available quantity: ${this.product.quantity}`;
    }
  }

  getStockStatusClass(): string {
    if (!this.product) return '';
    
    if (this.product.quantity === 0) {
      return 'out-of-stock';
    } else if (this.product.quantity <= 3) {
      return 'low-stock';
    } else {
      return 'in-stock';
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}