import create from 'zustand';
import { Register } from '../model';

export const useSignUpStore = create<{
  value: Register;
  setValue: (value: Register) => void;
}>((set) => ({
  value: { type: 1 },
  setValue(value) {
    set({ value });
  },
}));
