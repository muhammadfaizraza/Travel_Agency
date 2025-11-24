import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, Customer, Order, CreateCustomerData, CreateOrderData } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Customer', 'Order', 'Auth'],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation<void, { email: string; password: string; full_name: string }>({
      query: (data) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (data) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Customer endpoints
    getCustomers: builder.query<Customer[], string | void>({
      query: (search) => ({
        url: '/api/customers',
        params: search ? { search } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Customer' as const, id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),
    getCustomerById: builder.query<Customer, number>({
      query: (id) => `/api/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerData>({
      query: (data) => ({
        url: '/api/customers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),

    // Order endpoints
    getOrders: builder.query<Order[], void>({
      query: () => '/api/orders',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getOrdersByCustomer: builder.query<Order[], number>({
      query: (customerId) => `/api/orders/customer/${customerId}`,
      providesTags: (result, error, customerId) => [
        { type: 'Order', id: `CUSTOMER-${customerId}` },
      ],
    }),
    getCustomerRevenue: builder.query<{ customerId: number; totalRevenue: number }, number>({
      query: (customerId) => `/api/orders/customer/${customerId}/revenue`,
      providesTags: (result, error, customerId) => [
        { type: 'Order', id: `REVENUE-${customerId}` },
      ],
    }),
    createOrder: builder.mutation<Order, CreateOrderData>({
      query: (data) => ({
        url: '/api/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: `CUSTOMER-${arg.customer_id}` },
        { type: 'Order', id: `REVENUE-${arg.customer_id}` },
      ],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useGetOrdersQuery,
  useGetOrdersByCustomerQuery,
  useGetCustomerRevenueQuery,
  useCreateOrderMutation,
} = api;
