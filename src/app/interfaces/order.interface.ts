export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string; 
}
export interface OrderDetails {
    id: string;
    items: CartItem[];
    total: number;
    shipping: ShippingDetails;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    createdAt: Date;
  }
  
  export interface ShippingDetails {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  }