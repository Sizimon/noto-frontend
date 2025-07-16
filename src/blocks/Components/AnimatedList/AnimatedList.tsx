import React, { useRef, ReactNode, MouseEventHandler } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay, ease: "easeInOut" }}
      className="mb-4"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  displayScrollbar?: boolean;
  style?: React.CSSProperties;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = "",
  displayScrollbar = true,
  style,
}) => {
  return (
    <div className={`relative w-full ${className}`} style={style}>
      <div
        className={`w-full md:p-4 ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]"
            : "scrollbar-hide"
        }`}
        style={{
          scrollbarWidth: displayScrollbar ? "thin" : "none",
          scrollbarColor: "#222 #060010",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AnimatedList;