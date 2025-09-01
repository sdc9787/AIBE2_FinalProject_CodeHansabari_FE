import React from 'react';
import { createPortal } from 'react-dom';

export const Backdrop = ({ onClick }: { onClick: () => void }) => {
  return createPortal(
    <div
      className="fixed inset-0"
      style={{ zIndex: 9999, background: 'transparent' }}
      onClick={onClick}
    />,
    document.body,
  );
};
