import { useQuery } from "@tanstack/react-query";
const Quote = () => {
  //const [quote, setQuote] = useState("");
  //const [author, setAuthor] = useState("");

  const fetchQuote = async () => {
    return fetch("https://dummyjson.com/quotes/random").then((response) =>
      response.json()
    );
    // .then((data) => {
    //   setQuote(data.quote);
    //   setAuthor(data.author);
    // })
    // .catch(() => {
    //   setQuote("Unable to load quote right now.");
    //   setAuthor("");
    // });
  };
  const { isLoading, data } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuote,
    refetchInterval: 15000,
    refetchIntervalInBackground:false,
    refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  });

  return (
    <div className="flex flex-row justify-center  rounded-md -mt-2 transition-colors">
      <div className="relative inline-block inset-0">
        <img
          src="img/new-.jpg"
          alt="mountain"
          className="2xl:h-[500px] w-350 bg-center rounded-md"
        />
        <div className="absolute inset-0 bg-black/15 dark:bg-black/35 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto  bg-black/20 dark:bg-black/60 backdrop-blur-sm rounded-md px-6 py-4 max-w-[90%]">
            <h2 className="text-center text-xl md:text-2xl lg:text-3xl p-0 italic text-white">
              {isLoading ? "Loading..." : data?.quote}
            </h2>
            <p className="text-center text-sm mt-2 text-gray-200 dark:text-gray-300">
              — {isLoading ? "Loading..." : data?.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
