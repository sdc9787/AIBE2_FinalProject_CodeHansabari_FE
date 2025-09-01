import { create } from 'zustand';
import type { ReactNode, RefObject } from 'react';

interface ModalPosition {
  top: number;
  left: number;
}

export type ModalType = 'center' | 'position' | 'bottom';

interface ModalStore {
  content: ReactNode | null;
  isOpen: boolean;
  position: ModalPosition | null;
  type: ModalType;
  open: (
    content: ReactNode,
    ref?: RefObject<HTMLElement | null>,
    position?: ModalPosition | null,
    type?: ModalType,
  ) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  content: null,
  isOpen: false,
  position: null,
  type: 'center',
  open: (content, ref, position = null, type = 'center') => {
    let finalPosition = null;
    let finalType = type;

    if (ref?.current && type !== 'bottom') {
      const rect = ref.current.getBoundingClientRect();
      finalPosition = {
        top: rect.top + window.scrollY + rect.height + (position?.top ?? 0),
        left: rect.left + window.scrollX + (position?.left ?? 0),
      };
      finalType = 'position';
    } else if (position && type !== 'bottom') {
      finalPosition = position;
      finalType = 'position';
    }

    set({ isOpen: true, content, position: finalPosition, type: finalType });
  },
  close: () =>
    set({ isOpen: false, content: null, position: null, type: 'center' }),
}));
