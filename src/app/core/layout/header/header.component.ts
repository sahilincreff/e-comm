import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import User from '../../../shared/models/user'
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentUser: User | null=null;
  userLoggedIn: boolean=true;

  constructor(private cartService: CartService, private authService:AuthService){
    this.currentUser=this.authService.getCurrentUser();
    if(this.currentUser){
      this.userLoggedIn=true;
    }
  }

  getCartItemsCount(){
    return Object.keys(this.cartService.getCartItems()).length;
  }

  handleLogout(){
    this.authService.logout();
  }

}
