import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Trash2, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MoodEntry {
  id: string;
  entry: string;
  mood: string;
  timestamp: string;
}

const MOODS = [
  {
    emoji: "😊",
    label: "Happy",
    color: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  { emoji: "😢", label: "Sad", color: "bg-blue-100 dark:bg-blue-900/40" },
  { emoji: "😌", label: "Calm", color: "bg-purple-100 dark:bg-purple-900/40" },
  { emoji: "😤", label: "Frustrated", color: "bg-red-100 dark:bg-red-900/40" },
  { emoji: "🥰", label: "Loved", color: "bg-pink-100 dark:bg-pink-900/40" },
];

const MOOD_COLORS: Record<string, string> = {
  "😊": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "😢": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "😌": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "😤": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "🥰": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

export default function MoodCalendar() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadEntries = () => {
      const saved = localStorage.getItem("moodEntries");
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch (error) {
          console.error("Error parsing mood entries:", error);
          setEntries([]);
        }
      }
    };

    loadEntries();
  }, []);

  useEffect(() => {
    const handleMoodUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setEntries(customEvent.detail);
      }
    };

    window.addEventListener("moodUpdated", handleMoodUpdate);

    return () => {
      window.removeEventListener("moodUpdated", handleMoodUpdate);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "moodEntries" && e.newValue) {
        try {
          setEntries(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Error parsing mood entries from storage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const moodsByDate: Record<
    string,
    Array<{ mood: string; entry: string; time: string; id: string }>
  > = {};
  entries.forEach((e) => {
    const date = new Date(e.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!moodsByDate[dateKey]) {
      moodsByDate[dateKey] = [];
    }

    moodsByDate[dateKey].push({
      mood: e.mood,
      entry: e.entry,
      time: time,
      id: e.id,
    });
  });

  Object.keys(moodsByDate).forEach((dateKey) => {
    moodsByDate[dateKey].sort((a, b) => {
      const timeA = entries.find((e) => e.id === a.id)?.timestamp || "";
      const timeB = entries.find((e) => e.id === b.id)?.timestamp || "";
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
  });

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getSelectedDateMoods = () => {
    if (!selectedDate) return [];
    const key = formatDate(selectedDate);
    return moodsByDate[key] || [];
  };

  const modifiers = {
    hasMood: (date: Date) => {
      const key = formatDate(date);
      return !!moodsByDate[key] && moodsByDate[key].length > 0;
    },
  };

  const modifiersClassNames = {
    hasMood:
      "relative font-semibold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full",
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("moodEntries", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("moodUpdated", { detail: updated }));
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  const confirmDelete = (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const getMoodLabel = (emoji: string) => {
    return MOODS.find((m) => m.emoji === emoji)?.label || "";
  };

  const getMoodColor = (emoji: string) => {
    return (
      MOOD_COLORS[emoji] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-auto py-3 px-4 hover:bg-primary/5 transition-all duration-200"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">View Mood Calendar</span>
            {entries.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          side="bottom"
          sideOffset={10}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Calendar */}
            <div className="p-4 border-r">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="rounded-md"
              />
            </div>

            {/* Selected Date Details */}
            {selectedDate && getSelectedDateMoods().length > 0 && (
              <div className="w-80 p-4 ">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getSelectedDateMoods().length}{" "}
                    {getSelectedDateMoods().length === 1 ? "entry" : "entries"}
                  </p>
                </div>

                <ScrollArea className=" pr-3 h-56">
                  <div className="space-y-3">
                    {getSelectedDateMoods().map((moodData) => (
                      <Card
                        key={moodData.id}
                        className="group gap-0 border border-border/60 hover:border-primary/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <CardHeader className="pb-0 mb-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{moodData.mood}</span>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getMoodColor(moodData.mood)}`}
                              >
                                {getMoodLabel(moodData.mood)}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => confirmDelete(moodData.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 mt-0">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{moodData.time}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {selectedDate && getSelectedDateMoods().length === 0 && (
              <div className="w-80 p-8 flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-3 opacity-30">📝</div>
                <p className="text-sm text-muted-foreground">
                  No moods recorded for this day
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              mood entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => entryToDelete && handleDelete(entryToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
