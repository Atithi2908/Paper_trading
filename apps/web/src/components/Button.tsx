import React from 'react';

import type { MouseEventHandler } from 'react';
import type { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  fullWidth?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  className = '',
  fullWidth = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : ''} px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 font-medium transition shadow-lg ${className}`}
    >
      {children}
    </button>
  );
};

export default GradientButton;
