import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JournalEntry {
  id: string;
  entry: string;
  categories: string[];
  timestamp: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  stress: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  grateful:
    "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  anxious:
    "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  happy: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sad: "bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function RecentJournals() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const loadEntries = () => {
      const saved = localStorage.getItem("journalEntries");
      if (saved) {
        try {
          const allEntries = JSON.parse(saved);
          // Get only the 5 most recent entries
          setEntries(allEntries.slice(0, 5));
        } catch (error) {
          console.error("Error parsing journal entries:", error);
          setEntries([]);
        }
      }
    };

    loadEntries();
  }, []);

  useEffect(() => {
    const handleJournalUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setEntries(customEvent.detail.slice(0, 5));
      }
    };

    window.addEventListener("journalUpdated", handleJournalUpdate);

    return () => {
      window.removeEventListener("journalUpdated", handleJournalUpdate);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "journalEntries" && e.newValue) {
        try {
          const allEntries = JSON.parse(e.newValue);
          setEntries(allEntries.slice(0, 5));
        } catch (error) {
          console.error("Error parsing journal entries from storage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getCategoryColor = (category: string) => {
    return (
      CATEGORY_COLORS[category] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  // const truncateText = (text: string, maxLength: number = 100) => {
  //   if (text.length <= maxLength) return text;
  //   return text.slice(0, maxLength) + "...";
  // };

  return (
    <Card className="overflow-hidden border-border/60 shadow-md h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recent Journals</CardTitle>
          {entries.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {entries.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4 opacity-20">📝</div>
            <p className="text-muted-foreground text-sm mb-4">
              No journal entries yet
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="/journals">Start Writing</a>
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-3">
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card className="group gap-0  border border-border/60 hover:border-primary/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardHeader className=" ">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="opacity-60" />
                          <span className="text-xs font-medium">
                            {new Date(entry.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="opacity-60" />
                          <span className="text-xs font-medium">
                            {new Date(entry.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 mt-3">
                    <p className="text-sm leading-relaxed text-foreground/90 font-mono">
                      {entry.entry}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {entry.categories.length > 0 ? (
                        entry.categories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className={`text-xs px-2 py-0.5 capitalize ${getCategoryColor(category)}`}
                          >
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          No tags
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
