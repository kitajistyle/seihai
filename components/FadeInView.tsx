'use client';

import { motion } from 'motion/react';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left';
  tag?: 'div' | 'h2';
};

export default function FadeInView({ children, className, delay = 0, direction = 'up', tag = 'div' }: Props) {
  const initial = direction === 'up' ? { opacity: 0, y: 30 } : { opacity: 0, x: -20 };
  const target = direction === 'up' ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 };
  const props = {
    initial,
    whileInView: target,
    viewport: { once: true, margin: '-50px' } as const,
    transition: { duration: 0.5, delay },
    className,
  };
  if (tag === 'h2') return <motion.h2 {...props}>{children}</motion.h2>;
  return <motion.div {...props}>{children}</motion.div>;
}
