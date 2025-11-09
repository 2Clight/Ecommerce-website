import { motion, useAnimation } from "framer-motion";
import img from "../assets/img1.jpg";
import { useEffect, useRef, useState } from "react";

const HomePage = () => {
  const spread = useAnimation();
  const stackImages = [img, img, img, img, img, img, img];
  const containerRef = useRef(null);
  const collapsedRef = useRef(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const spreadConfig = [
    { x: -200, y: 0, rotate: -12 },
    { x: -160, y: 0, rotate: -8 },
    { x: -80, y: 0, rotate: -5 },
    { x: 0, y: 0, rotate: 0 },
    { x: 80, y: 0, rotate: 5 },
    { x: 160, y: 5, rotate: 10 },
    { x: 200, y: 10, rotate: 12 },
  ];
  const collapsed = { x: 0, y: 0, rotate: 0 };

  const originalTopRef = useRef(null);

  // Initial rise + spread
  useEffect(() => {
    spread.start((i) => ({
      y: i === stackImages.length - 1 ? -10 : 0,
      opacity: i === stackImages.length - 1 ? 1 : 0,
      scale: 1,
      transition: { type: "spring", stiffness: 55, damping: 15, duration: 1.2 },
    })).then(() => {
      spread.start((i) => ({
        x: spreadConfig[i].x * 1.8,
        y: spreadConfig[i].y,
        rotate: spreadConfig[i].rotate,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 55, damping: 14, duration: 1 },
      })).then(() => {
        setScrollEnabled(true);
        originalTopRef.current = containerRef.current.offsetTop; // store original top
      });
    });
  }, []);

  useEffect(() => {
    if (!scrollEnabled) return;

    const section = document.getElementById("stackSection");

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight * 0.8;
      const end = windowHeight / 10;
      let rawProgress = (start - rect.top) / (start - end);
      let progress = Math.min(Math.max(rawProgress, 0), 1);
      progress = 1 - progress;

      // Normal collapse interpolation if not in southeast mode
      if (!collapsedRef.current) {
        spread.start((i) => ({
          x: collapsed.x + (spreadConfig[i].x * 1.8 - collapsed.x) * progress,
          y: collapsed.y + (spreadConfig[i].y - collapsed.y) * progress,
          rotate: collapsed.rotate + (spreadConfig[i].rotate - collapsed.rotate) * progress,
          opacity: 1,
          scale: 1,
          transition: { type: "tween", duration: 0.05 },
        }));
      }

      // Trigger southeast animation
      if (progress === 0 && !collapsedRef.current) {
        collapsedRef.current = true;

        // Compute landing position
        const sectionBottom = section.offsetTop + section.offsetHeight;
        const containerHeight = containerRef.current.offsetHeight;
        const targetTop = sectionBottom - containerHeight;

        // Switch to absolute so it stays with section 2
        containerRef.current.style.position = "absolute";
        containerRef.current.style.left = "50%";
        containerRef.current.style.transform = "translateX(-50%)";
        containerRef.current.style.marginTop = "-250px";

        // Animate southeast spread
        spread.start((i) => ({
          x: 80 + i * 95,
          y: 70 + i * 25,
          opacity: 1,
          scale: 1,
          transition: { type: "spring", stiffness: 50, damping: 16, duration: 0.6 },
        }));

        // Move container to landing position
        containerRef.current.style.top = `${targetTop}px`;
      }

      // Restore if scrolling back
      if (progress > 0 && collapsedRef.current) {
        collapsedRef.current = false;

        // Animate container back to fixed first section
        containerRef.current.style.position = "fixed";
        containerRef.current.style.top = `${originalTopRef.current}px`;
        containerRef.current.style.left = "25%";
        containerRef.current.style.transform = "translateX(-100%)";
        containerRef.current.style.transform = "translateY(50%)";
        

        spread.start((i) => ({
          x: collapsed.x + (spreadConfig[i].x * 1.8 - collapsed.x) * progress,
          y: collapsed.y + (spreadConfig[i].y - collapsed.y) * progress,
          rotate: collapsed.rotate + (spreadConfig[i].rotate - collapsed.rotate) * progress,
          opacity: 1,
          scale: 1,
          transition: { type: "tween", duration: 0.12 },
        }));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollEnabled]);

  return (
    <>
      <section className="flex flex-col items-center min-h-screen text-center px-4 overflow-hidden pt-50">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700  to-white">
        
      </div>
        <h1 className="text-4xl md:text-6xl text-white font-semibold leading-tight z-100">
          A place to display your <span className="text-gray-700 font-bold">masterpiece.</span>
        </h1>
        <div
          ref={containerRef}
          className="fixed mt-28 w-[760px] max-w-[92vw] h-56 z-10 pointer-events-none"
        >
          {stackImages.map((src, i) => (
            <motion.div
              key={i}
              custom={i}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-44 md:w-52 md:h-52 rounded-2xl shadow-xl overflow-hidden"
              initial={false}
              animate={spread}
              style={{ zIndex: i + 1 }}
            >
              <img src={src} alt={`art-${i}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="stackSection"
        className="relative flex flex-col items-start justify-center min-h-screen bg-white px-4 overflow-x-hidden"
      >
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-6 text-black">
          Another Section
        </h2>
        <p className="max-w-xl text-gray-700 text-lg md:text-xl">
          Scroll down to see the stack retract back into a single card.
        </p>
      </section>

      <section className="relative flex flex-col items-start justify-center min-h-screen px-4">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-6">
          3rd Section
        </h2>
      </section>
    </>
  );
}

export default HomePage;