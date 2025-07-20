"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function CollagePhoto({
  index,
  row,
  col,
  photoWidth,
  photoHeight,
  rotate,
  delay,
}) {
  return (
    <motion.div
      key={index}
      className="absolute rounded-lg overflow-hidden"
      style={{
        top: `${row * photoHeight}px`,
        left: `${col * photoWidth}px`,
        width: `${photoWidth}px`,
        height: `${photoHeight}px`,
        transform: `rotate(${rotate}deg)`,
        boxShadow:
          "0 0 15px rgba(255, 105, 180, 0.7), 0 0 25px rgba(255, 105, 180, 0.5)",
      }}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{
        opacity: 0.6,
        scale: 1,
        y: 0,
        transition: {
          opacity: { duration: 0.8, delay, ease: "easeOut" },
          scale: { duration: 0.8, delay, ease: "easeOut" },
          y: { duration: 0.8, delay, ease: "easeOut" },
        },
      }}
      whileHover={{ opacity: 0.8, scale: 1.05, transition: { duration: 0.3 } }}
      whileInView={{
        y: [0, -10, 0],
        transition: {
          y: {
            duration: 3 + (typeof window !== "undefined" ? Math.random() * 2 : 0),
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: typeof window !== "undefined" ? Math.random() * 2 : 0,
          },
        },
      }}
    >
      <Image
        src={`/placeholder/thumb-${(index % 7) + 1}.jpg`}
        priority
        alt={`Background photo ${index + 1}`}
        fill
        sizes="(max-width: 600px) 100vw, 33vw"
        style={{ objectFit: "cover" }}
        onError={() => console.error(`Failed to load image ${index + 1}`)}
        
      />
    </motion.div>
  );
}