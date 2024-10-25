import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import User from '../../../shared/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  userLoggedIn: boolean = false;

  constructor(private cartService: CartService, private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.userLoggedIn = !!this.currentUser; 
  }

  getCartItemsCount() {
    const cartItems = this.cartService.getCartItems();
    return cartItems ? Object.keys(cartItems).length : 0; 
  }

  handleLogout() {
    this.authService.logout();
    this.userLoggedIn = false;
  }
}
