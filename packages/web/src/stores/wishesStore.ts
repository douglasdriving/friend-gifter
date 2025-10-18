import { create } from 'zustand';
import type { Wish } from '@friend-gifting/shared';

interface WishesState {
  wishes: Wish[];
  myWishes: Wish[];
  selectedWish: Wish | null;
  isLoading: boolean;
  error: string | null;
  setWishes: (wishes: Wish[]) => void;
  setMyWishes: (wishes: Wish[]) => void;
  setSelectedWish: (wish: Wish | null) => void;
  addWish: (wish: Wish) => void;
  updateWish: (id: string, wish: Wish) => void;
  removeWish: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWishesStore = create<WishesState>((set) => ({
  wishes: [],
  myWishes: [],
  selectedWish: null,
  isLoading: false,
  error: null,

  setWishes: (wishes) => set({ wishes }),
  setMyWishes: (wishes) => set({ myWishes: wishes }),
  setSelectedWish: (wish) => set({ selectedWish: wish }),

  addWish: (wish) =>
    set((state) => ({
      myWishes: [wish, ...state.myWishes],
    })),

  updateWish: (id, wish) =>
    set((state) => ({
      wishes: state.wishes.map((w) => (w.id === id ? wish : w)),
      myWishes: state.myWishes.map((w) => (w.id === id ? wish : w)),
      selectedWish: state.selectedWish?.id === id ? wish : state.selectedWish,
    })),

  removeWish: (id) =>
    set((state) => ({
      wishes: state.wishes.filter((w) => w.id !== id),
      myWishes: state.myWishes.filter((w) => w.id !== id),
      selectedWish: state.selectedWish?.id === id ? null : state.selectedWish,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
