import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export default function BlurText({
  text = "",
  delay = 100,
  className = "",
  animateBy = "words", // 'words' or 'letters'
  direction = "top", // 'top' or 'bottom'
}) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((segment, i) => (
        <motion.span
          key={i}
          initial={{
            filter: "blur(10px)",
            opacity: 0,
            y: direction === "top" ? -18 : 18,
          }}
          animate={
            inView
              ? {
                  filter: "blur(0px)",
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.55,
            delay: (i * delay) / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {segment}
          {animateBy === "words" && i < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </span>
  );
}
