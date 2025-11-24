export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  departure_city: string;
  destination_city: string;
  travel_date: string;
  flight_price: number;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface CreateCustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface CreateOrderData {
  customer_id: number;
  departure_city: string;
  destination_city: string;
  travel_date: string;
  flight_price: number;
}
