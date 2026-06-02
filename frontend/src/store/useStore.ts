import { create } from 'zustand';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  milk?: string;
}

interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
}

interface AppState {
  // Theme State
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Cart State
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number, size?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Auth State
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  theme: 'dark', // Premium coffee apps look exceptional in Dark Mode by default
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(nextTheme);
    }
    return { theme: nextTheme };
  }),

  cart: [],
  addToCart: (item) => set((state) => {
    const existingIndex = state.cart.findIndex(
      (i) => i.id === item.id && i.size === item.size && i.milk === item.milk
    );
    if (existingIndex > -1) {
      const newCart = [...state.cart];
      newCart[existingIndex].quantity += 1;
      return { cart: newCart };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (id, size) => set((state) => ({
    cart: state.cart.filter((item) => !(item.id === id && item.size === size))
  })),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  token: typeof window !== 'undefined' ? localStorage.getItem('beanco_token') : null,
  user: typeof window !== 'undefined' && localStorage.getItem('beanco_user') 
    ? JSON.parse(localStorage.getItem('beanco_user') || '{}') 
    : null,
  login: (token, user) => {
    localStorage.setItem('beanco_token', token);
    localStorage.setItem('beanco_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('beanco_token');
    localStorage.removeItem('beanco_user');
    set({ token: null, user: null });
  }
}));
