import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
        });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },

      updateUser: (userData) => {
        set({ user: userData });
        localStorage.setItem('user', JSON.stringify(userData));
      },

      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          set({
            user: JSON.parse(user),
            token,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

// Cart store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, size) => {
        const { items } = get();
        const existingItem = items.find(
          item => 
            item.product._id === product._id && 
            item.size === size
        );

        if (existingItem) {
          set({
            items: items.map(item =>
              item === existingItem
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, {
              product,
              quantity,
              size,
              price: product.price,
            }],
          });
        }
      },

      removeItem: (productId, size) => {
        const { items } = get();
        set({
          items: items.filter(
            item => 
              !(item.product._id === productId && 
                item.size === size)
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        const { items } = get();
        set({
          items: items.map(item =>
            item.product._id === productId && 
            item.size === size
              ? { ...item, quantity: Math.max(0, Math.min(quantity, item.product.stock)) }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartItems: () => {
        return get().items;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// UI store
export const useUIStore = create((set) => ({
  loading: false,
  error: null,
  success: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
  clearMessages: () => set({ error: null, success: null }),
}));

// Product store
export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  newArrivals: [],
  bestSellers: [],
  currentProduct: null,
  filters: {
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },

  setProducts: (products) => set({ products }),
  setFeaturedProducts: (products) => set({ featuredProducts: products }),
  setNewArrivals: (products) => set({ newArrivals: products }),
  setBestSellers: (products) => set({ bestSellers: products }),
  setCurrentProduct: (product) => set({ currentProduct: product }),
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) => set({ pagination }),
  clearFilters: () => set({
    filters: {
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: '',
    },
  }),
}));

// Order store
export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  orderHistory: [],

  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setOrderHistory: (orders) => set({ orderHistory: orders }),
  addOrder: (order) => set(state => ({ 
    orders: [order, ...state.orders],
    orderHistory: [order, ...state.orderHistory]
  })),
  updateOrder: (orderId, updatedOrder) => set(state => ({
    orders: state.orders.map(order => 
      order._id === orderId ? updatedOrder : order
    ),
    orderHistory: state.orderHistory.map(order => 
      order._id === orderId ? updatedOrder : order
    ),
  })),
}));

export const useWishlistStore = create((set, get) => ({
  items: [],
  addItem: (product) => {
    set(state => {
      if (state.items.find(item => item._id === product._id)) return state;
      return { items: [...state.items, product] };
    });
  },
  removeItem: (productId) => {
    set(state => ({ items: state.items.filter(item => item._id !== productId) }));
  },
  clear: () => set({ items: [] }),
})); 