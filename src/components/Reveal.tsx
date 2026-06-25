import { useScrollReveal } from "@/hooks/useScrollReveal";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  distance?: string;
  duration?: number;
  className?: string;
}

export const Reveal = ({ children, delay = 0, distance = "30px", duration = 800, className = "" }: RevealProps) => {
  const ref = useScrollReveal({ delay, distance, duration });
  return <div ref={ref} className={className}>{children}</div>;
};

export default Reveal;
