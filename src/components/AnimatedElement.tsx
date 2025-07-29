import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface AnimatedElementProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'fadeInUp' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  trigger?: 'mount' | 'scroll' | 'hover';
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  className = '',
  trigger = 'mount'
}) => {
  const [isVisible, setIsVisible] = useState(trigger === 'mount');
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === 'scroll') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (trigger === 'mount') {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all ease-out';
    const durationClass = `duration-${Math.min(Math.max(duration, 100), 1000)}`;
    
    if (!isVisible && trigger !== 'hover') {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} ${durationClass} opacity-0`;
        case 'slideUp':
          return `${baseClasses} ${durationClass} opacity-0 translate-y-8`;
        case 'scaleIn':
          return `${baseClasses} ${durationClass} opacity-0 scale-95`;
        case 'fadeInUp':
          return `${baseClasses} ${durationClass} opacity-0 translate-y-4`;
        default:
          return baseClasses;
      }
    }

    const hoverEffect = trigger === 'hover' && isHovered ? 'scale-105 shadow-xl' : '';
    
    switch (animation) {
      case 'fadeIn':
        return `${baseClasses} ${durationClass} opacity-100 ${hoverEffect}`;
      case 'slideUp':
        return `${baseClasses} ${durationClass} opacity-100 translate-y-0 ${hoverEffect}`;
      case 'scaleIn':
        return `${baseClasses} ${durationClass} opacity-100 scale-100 ${hoverEffect}`;
      case 'fadeInUp':
        return `${baseClasses} ${durationClass} opacity-100 translate-y-0 ${hoverEffect}`;
      default:
        return `${baseClasses} ${hoverEffect}`;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => trigger === 'hover' && setIsHovered(true)}
      onMouseLeave={() => trigger === 'hover' && setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default AnimatedElement;