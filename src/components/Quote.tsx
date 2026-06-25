import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import anime from "animejs";

const Quote = () => {
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);

  const fetchQuote = async () => {
    return fetch("https://dummyjson.com/quotes/random").then((response) =>
      response.json()
    );
  };
  
  const { isLoading, data } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuote,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!isLoading && data && quoteRef.current && authorRef.current) {
      // Split text into words or animate entire block smoothly
      anime.timeline({ loop: false })
        .add({
          targets: quoteRef.current,
          opacity: [0, 1],
          translateY: [20, 0],
          easing: "easeOutExpo",
          duration: 1200,
        })
        .add({
          targets: authorRef.current,
          opacity: [0, 1],
          translateX: [-20, 0],
          easing: "easeOutExpo",
          duration: 1000,
        }, "-=800");
    }
  }, [isLoading, data]);

  return (
    <div className="flex flex-row justify-center rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl duration-500 relative group">
      <div className="relative w-full">
        <img
          src="img/new-.jpg"
          alt="mountain"
          className="w-full h-[300px] md:h-[400px] 2xl:h-[500px] object-cover rounded-xl transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/60 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
          <div className="pointer-events-auto bg-black/30 dark:bg-black/50 backdrop-blur-md rounded-2xl px-8 py-6 max-w-[90%] border border-white/10 shadow-2xl">
            <h2 
              ref={quoteRef}
              className="text-center text-2xl md:text-3xl lg:text-4xl font-serif italic text-white/90 leading-relaxed opacity-0"
            >
              "{isLoading ? "Loading wisdom..." : data?.quote}"
            </h2>
            <p 
              ref={authorRef}
              className="text-center text-sm md:text-base mt-4 text-white/70 font-medium tracking-wide opacity-0"
            >
              — {isLoading ? "..." : data?.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
