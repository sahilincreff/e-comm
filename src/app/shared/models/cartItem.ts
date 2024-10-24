export interface cartItem{
    productId: string;
    brand: string;
    name: string;
    description: string;
    images: string[];
    price: {
        mrp: number;
        sellingPrice: number;
    };
    usp: string[]
    rating: number;
    quantity: number;
}