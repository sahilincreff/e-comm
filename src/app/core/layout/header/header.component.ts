import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import User from '../../../shared/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userLoggedIn: boolean = false;
  private currentUserSubscription!: Subscription;

  isModalVisible = false;

  showModal() {
    this.isModalVisible = true;
  }

  handleConfirmation(confirmed: boolean) {
    if (confirmed) this.handleLogout();
    this.isModalVisible = false;
  }

  constructor(private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.userLoggedIn = !!this.currentUser;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  getCartItemsCount(): number {
    const cartItems = this.cartService.getCartItems();
    return Object.keys(cartItems).length;
  }

  handleLogout(): void { 
    this.authService.logout();
    this.userLoggedIn = false; 
    this.cartService.clearCart();
  }
}
