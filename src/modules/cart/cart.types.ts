export interface CartItemResponse {
    productId: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
    subtotal: number;
}

export interface CartResponse {
    items: CartItemResponse[];
    grandTotal: number;
}