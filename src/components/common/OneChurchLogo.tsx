import React from 'react';

interface OneChurchLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const OneChurchLogo: React.FC<OneChurchLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="100" cy="100" r="100" fill="currentColor"/>
        
        {/* Main cross/abstract pattern inspired by the logo */}
        <path d="M40 60 L100 40 L160 60 L160 140 L100 160 L40 140 Z" fill="white" opacity="0.9"/>
        <path d="M60 80 L100 65 L140 80 L140 120 L100 135 L60 120 Z" fill="currentColor"/>
        <path d="M80 95 L100 88 L120 95 L120 105 L100 112 L80 105 Z" fill="white"/>
        
        {/* Additional geometric elements */}
        <path d="M70 50 L130 50 L130 70 L100 85 L70 70 Z" fill="white" opacity="0.7"/>
        <path d="M70 130 L100 115 L130 130 L130 150 L70 150 Z" fill="white" opacity="0.7"/>
        <path d="M30 90 L50 80 L50 120 L30 110 Z" fill="white" opacity="0.6"/>
        <path d="M150 80 L170 90 L170 110 L150 120 Z" fill="white" opacity="0.6"/>
      </svg>
    </div>
  );
};

export default OneChurchLogo;