import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import User from '../../../shared/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userLoggedIn: boolean = false;
  private currentUserSubscription!: Subscription;
  dropdownVisible: boolean = false;
  isModalVisible = false;

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.userLoggedIn = !!this.currentUser;
    });
  }

  showModal() {
    this.isModalVisible = true;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  handleConfirmation(confirmed: boolean) {
    if (confirmed) this.handleLogout();
    this.isModalVisible = false;
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  getCartItemsCount(): number {
    const cartItems = this.cartService.getCartItems();
    let cartItemsCount = 0;
    Object.keys(cartItems).map((currItem) => {
      cartItemsCount += cartItems[currItem]
    })
    return cartItemsCount;
  }

  handleLogout(): void {
    this.authService.logout();
    this.userLoggedIn = false;
    this.cartService.clearCart();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
