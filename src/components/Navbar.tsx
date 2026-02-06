"use client";
import {
  Book,
  Moon,
  SearchIcon,
  Settings,
  Smile,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "./ui/sidebar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

interface JournalEntry {
  id: string;
  entry: string;
  categories: string[];
  timestamp: string;
}

interface MoodEntry {
  id: string;
  entry: string;
  mood: string;
  timestamp: string;
}

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const { setTheme } = useTheme();

  useEffect(() => {
    const j = localStorage.getItem("journalEntries");
    const m = localStorage.getItem("moodEntries");

    if (j) setJournals(JSON.parse(j));
    if (m) setMoods(JSON.parse(m));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lower = text.toLowerCase();

    const journalMatches = journals
      .filter((j) => j.entry.toLowerCase().includes(lower))
      .map((j) => ({ type: "journal", ...j }));

    const moodMatches = moods
      .filter(
        (m) =>
          m.entry.toLowerCase().includes(lower) ||
          m.mood.toLowerCase().includes(lower),
      )
      .map((m) => ({ type: "mood", ...m }));

    setResults([...journalMatches, ...moodMatches]);
    setIsOpen(true);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-50 border-b border-border/40">
      {/* LEFT */}
      <SidebarTrigger />

      {/* CENTER - SEARCH */}
      <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
        <InputGroup>
          <InputGroupInput
            placeholder="Search journals and moods..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            className="pr-10"
          />
          <InputGroupAddon>
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>

        {/* Search Results Dropdown */}
        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg border-border/60 z-50 max-h-[400px] overflow-hidden">
            {results.length > 0 ? (
              <ScrollArea className="h-full max-h-[400px]">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {results.map((item) => (
                      <Link
                        key={item.id}
                        to={item.type === "journal" ? "/journal" : "/mood"}
                        onClick={handleResultClick}
                        className="block"
                      >
                        <div className="rounded-md p-3 hover:bg-accent transition-colors cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {item.type === "journal" ? <Book /> : <Smile />}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-xs capitalize"
                            >
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/90 line-clamp-2 mb-1">
                            {item.entry}
                          </p>
                          {item.type === "journal" &&
                            item.categories.length > 0 && (
                              <div className="flex gap-1 flex-wrap mb-1">
                                {item.categories
                                  .slice(0, 3)
                                  .map((cat: string) => (
                                    <Badge
                                      key={cat}
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0"
                                    >
                                      {cat}
                                    </Badge>
                                  ))}
                              </div>
                            )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </ScrollArea>
            ) : (
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2 opacity-20">🔍</div>
                <p className="text-sm text-muted-foreground">
                  No results found for "{query}"
                </p>
              </CardContent>
            )}
          </Card>
        )}
      </div>

      {/* RIGHT - THEME TOGGLE */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="h-4 w-4 mr-2" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Settings className="h-4 w-4 mr-2" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
