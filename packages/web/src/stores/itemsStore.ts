import { create } from 'zustand';
import type { Item } from '@friend-gifting/shared';

interface ItemsState {
  items: Item[];
  myItems: Item[];
  selectedItem: Item | null;
  isLoading: boolean;
  error: string | null;
  setItems: (items: Item[]) => void;
  setMyItems: (items: Item[]) => void;
  setSelectedItem: (item: Item | null) => void;
  addItem: (item: Item) => void;
  updateItem: (id: string, item: Item) => void;
  removeItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useItemsStore = create<ItemsState>((set) => ({
  items: [],
  myItems: [],
  selectedItem: null,
  isLoading: false,
  error: null,

  setItems: (items) => set({ items }),
  setMyItems: (items) => set({ myItems: items }),
  setSelectedItem: (item) => set({ selectedItem: item }),

  addItem: (item) =>
    set((state) => ({
      myItems: [item, ...state.myItems],
    })),

  updateItem: (id, item) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? item : i)),
      myItems: state.myItems.map((i) => (i.id === id ? item : i)),
      selectedItem: state.selectedItem?.id === id ? item : state.selectedItem,
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      myItems: state.myItems.filter((i) => i.id !== id),
      selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
