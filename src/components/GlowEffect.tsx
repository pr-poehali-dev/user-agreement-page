import React, { ReactNode } from 'react';

interface GlowEffectProps {
  children: ReactNode;
  color?: 'teal' | 'gold' | 'purple' | 'blue';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  animated?: boolean;
}

const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color = 'teal',
  intensity = 'medium',
  className = '',
  animated = false
}) => {
  const getGlowClasses = () => {
    const colorMap = {
      teal: 'shadow-naga-teal/30',
      gold: 'shadow-naga-gold/30',
      purple: 'shadow-purple-500/30',
      blue: 'shadow-blue-500/30'
    };

    const intensityMap = {
      low: 'shadow-lg',
      medium: 'shadow-xl',
      high: 'shadow-2xl'
    };

    const animationClass = animated ? 'animate-pulse' : '';

    return `${colorMap[color]} ${intensityMap[intensity]} ${animationClass}`;
  };

  return (
    <div className={`${getGlowClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default GlowEffect;