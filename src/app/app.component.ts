import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './user/components/product-card/product-card.component';
import { ProductService } from './service/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule, CommonModule],
  template: `
    <header>
      <nav>
        <div class="logo">
          <h1>Angular Store</h1>
        </div>
        <div class="nav-links">
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/cart">Cart</a></li>
            <li><a routerLink="/admin">Admin</a></li>
          </ul>
        </div>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search products..."
            [(ngModel)]="searchTerm"  
            (input)="onSearchChange()"  
          />
          <button (click)="onSearch()">Search</button>
        </div>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
header {
  background-color: #333;
  padding: 1rem;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  flex-wrap: wrap;
}

nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}

nav .logo {
  flex: 1;
  color: #fff;
}

nav .nav-links {
  flex: 2;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

nav .nav-links ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

nav .nav-links a {
  color: white;
  text-decoration: none;
}

nav .search-bar {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

nav .search-bar input {
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  outline: none;
}

nav .search-bar button {
  padding: 0.5rem;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

nav .search-bar button:hover {
  background-color: #e68900;
}

main {
  padding: 1rem;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: stretch;
  }

  nav .logo {
    flex: 0;
    text-align: center;
    margin-bottom: 1rem;
  }

  nav .nav-links {
    flex: 0;
    justify-content: space-around;
    width: 100%;
  }

  nav .search-bar {
    flex: 0;
    justify-content: center;
    margin-top: 1rem;
  }

  nav .search-bar input {
    width: 70%;
  }

  nav .search-bar button {
    width: 25%;
  }
}



  `]
})
export class AppComponent {
  searchTerm: string = '';

  constructor(private productService: ProductService) {}

  onSearchChange() {
    this.productService.updateSearchTerm(this.searchTerm);
  }
  
  onSearch() {
    this.productService.updateSearchTerm(this.searchTerm);
  }
}