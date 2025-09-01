'use client';
import { useRef, useEffect, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useModalStore } from '../model/useModalStore';
import { Backdrop } from './Backdrop';

export const Modal = () => {
  // 전역 모달 상태를 가져옴
  const { content, isOpen, close, position, type } = useModalStore();

  // 모달의 backdrop을 가리키는 ref
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열리면 스크롤 비활성화 (포지셔닝 모달은 스크롤 허용)
  useEffect(() => {
    if (isOpen && type !== 'position') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, type]);

  // 모달 backdrop을 클릭한 경우 모달을 닫음
  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      close();
    }
  };

  // 모달이 열려있지 않거나 서버에서 실행되는 경우를 차단
  if (!isOpen || typeof window === 'undefined') return null;

  // 하단 모달 (모바일용)
  if (type === 'bottom') {
    return createPortal(
      <div
        ref={modalRef}
        onClick={handleClickOutside}
        className="bg-opacity-50 fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{
            type: 'tween',
            duration: 0.23,
            ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>{content}</div>
        </motion.div>
      </div>,
      document.body,
    );
  }

  // 버튼 기준 위치에 모달을 띄우는 경우 (position이 있으면)
  if (type === 'position') {
    return createPortal(
      <>
        <Backdrop onClick={close} />
        <motion.div
          ref={modalRef}
          onClick={handleClickOutside}
          style={{
            position: 'absolute',
            top: position?.top,
            left: position?.left,
            zIndex: 10000,
          }}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
        >
          <div onClick={(e) => e.stopPropagation()}>{content}</div>
        </motion.div>
      </>,
      document.body,
    );
  }

  // 기존 중앙 모달 (백드랍)
  return createPortal(
    <div
      ref={modalRef}
      onClick={handleClickOutside}
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
      >
        <div onClick={(e) => e.stopPropagation()}>{content}</div>
      </motion.div>
    </div>,
    document.body,
  );
};
