import { Injectable } from '@angular/core';
import { cartItem } from 'src/app/shared/models/cartItem';
import { Product } from 'src/app/shared/models/product';
import { ProductsService } from '../products/products.service';
import { Cart } from 'src/app/shared/models/cart';
import { LocalStorageService } from '../localStorage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: Cart={}

  constructor(private productService: ProductsService, private localStorageService: LocalStorageService) {
    const cartItemsString = this.localStorageService.getCartItems();
    if(cartItemsString){
      try{
        this.cartItems = JSON.parse(cartItemsString);
      }catch(error){
        console.error("Error parsing cart items from local storage:", error);
        this.cartItems = {};
      }
    }else{
      this.cartItems={};
    }
  }

  productInCart(productId: string){
    return this.cartItems[productId]  ? true : false;
  }

  updateCart(){
    this.localStorageService.updateCart(this.cartItems);
  }

  addProductToCart(productId: string){
    let products: Product[]=[];
    products=this.productService.getProducts();
    products.map((singleProduct: Product)=>{
      if(singleProduct.productId===productId){
        let tempObj: cartItem={...singleProduct, quantity: 1};
        this.cartItems[productId]=tempObj;
      }
    })
    this.updateCart();
  }

  removeItemFromCart(productId: string){
    delete this.cartItems[productId];
    this.updateCart();
  }

  increaseQuantity(productId: string, quantity: number=1){
    this.cartItems[productId].quantity+=quantity;
    this.updateCart();
  }

  decreaseQuantity(productId: string, quantity: number=1){
    if(this.cartItems[productId].quantity-quantity<=0){
      this.removeItemFromCart(productId);
    }else{
      this.cartItems[productId].quantity-=quantity;
    }
    this.updateCart();
  }

  getCartItems(){
    return this.cartItems;
  }

  getItemQuantityInCart(productId: string){
    return this.cartItems[productId].quantity;
  }

  clearCart(){
    this.cartItems={}
  }

}
