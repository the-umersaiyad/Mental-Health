import { useEffect, useRef } from "react";
import anime from "animejs";
import "./CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // Move the inner dot immediately
      if (cursorRef.current) {
        cursorRef.current.style.left = `${clientX}px`;
        cursorRef.current.style.top = `${clientY}px`;
      }

      // Smoothly animate the outer ring
      if (cursorRingRef.current) {
        anime({
          targets: cursorRingRef.current,
          left: `${clientX}px`,
          top: `${clientY}px`,
          duration: 100,
          easing: "easeOutSine",
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer");

      if (isClickable && cursorRingRef.current && cursorRef.current) {
        anime({
          targets: cursorRingRef.current,
          width: "60px",
          height: "60px",
          duration: 300,
          easing: "easeOutExpo",
        });
        anime({
          targets: cursorRef.current,
          translateX: "-50%",
          translateY: "-50%",
          scale: 0.5,
          duration: 300,
          easing: "easeOutExpo",
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer");

      if (isClickable && cursorRingRef.current && cursorRef.current) {
        anime({
          targets: cursorRingRef.current,
          width: "40px",
          height: "40px",
          duration: 300,
          easing: "easeOutExpo",
        });
        anime({
          targets: cursorRef.current,
          translateX: "-50%",
          translateY: "-50%",
          scale: 1,
          duration: 300,
          easing: "easeOutExpo",
        });
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current) {
        anime({
          targets: cursorRef.current,
          translateX: "-50%",
          translateY: "-50%",
          scale: 0.8,
          duration: 100,
          easing: "easeOutQuad",
        });
      }
    };

    const handleMouseUp = () => {
      if (cursorRef.current) {
        anime({
          targets: cursorRef.current,
          translateX: "-50%",
          translateY: "-50%",
          scale: 1,
          duration: 100,
          easing: "easeOutQuad",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={cursorRingRef} className="custom-cursor-ring hidden md:block pointer-events-none" />
      <div ref={cursorRef} className="custom-cursor hidden md:block pointer-events-none" />
    </>
  );
};

export default CustomCursor;
