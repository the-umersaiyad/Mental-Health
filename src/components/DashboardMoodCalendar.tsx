import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";

interface MoodEntry {
  id: string;
  entry: string;
  mood: string;
  timestamp: string;
}

const MOODS = [
  { emoji: "😊", label: "Happy", color: "bg-emerald-100 dark:bg-emerald-900/40" },
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

export default function DashboardMoodCalendar() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  const moodsByDate: Record<string, Array<{ mood: string; entry: string; time: string; id: string }>> = {};
  entries.forEach((e) => {
    const date = new Date(e.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    if (!moodsByDate[dateKey]) {
      moodsByDate[dateKey] = [];
    }
    
    moodsByDate[dateKey].push({ 
      mood: e.mood, 
      entry: e.entry, 
      time: time,
      id: e.id 
    });
  });

  Object.keys(moodsByDate).forEach(dateKey => {
    moodsByDate[dateKey].sort((a, b) => {
      const timeA = entries.find(e => e.id === a.id)?.timestamp || '';
      const timeB = entries.find(e => e.id === b.id)?.timestamp || '';
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
  });

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
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
    }
  };

  const modifiersClassNames = {
    hasMood: "relative font-semibold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full"
  };

  const getMoodLabel = (emoji: string) => {
    return MOODS.find((m) => m.emoji === emoji)?.label || "";
  };

  const getMoodColor = (emoji: string) => {
    return MOOD_COLORS[emoji] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-md h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Mood Calendar</CardTitle>
          {entries.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {entries.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="w-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md w-full p-0"
            classNames={{
              months: "w-full flex flex-col",
              caption: "flex justify-center pt-1 relative items-center mb-4",
              caption_label: "text-base font-semibold",
              nav: "space-x-1 flex items-center justify-between",
              nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-md",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse",
              head_row: "flex w-full mb-2",
              head_cell: "text-muted-foreground rounded-md flex-1 font-medium text-sm",
              row: "flex w-full gap-1 mb-1",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 aspect-square",
              day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md transition-colors",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside: "text-muted-foreground opacity-40",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
          />
        </div>

        {selectedDate && getSelectedDateMoods().length > 0 && (
          <div className="space-y-3">
            <div className="border-t pt-3">
              <h4 className="font-semibold text-sm mb-2">
                {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric'
                })}
              </h4>
            </div>

            <ScrollArea className="h-[150px]">
              <div className="space-y-2 pr-3">
                {getSelectedDateMoods().map((moodData) => (
                  <Card 
                    key={moodData.id}
                    className="border-l-2 border-l-primary/40"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{moodData.mood}</span>
                        <div className="flex-1 min-w-0">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs mb-1 ${getMoodColor(moodData.mood)}`}
                          >
                            {getMoodLabel(moodData.mood)}
                          </Badge>
                          <p className="text-xs text-foreground/70">
                            {moodData.entry}
                          </p>
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <Clock className="h-2.5 w-2.5" />
                            <span className="text-[10px]">{moodData.time}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {selectedDate && getSelectedDateMoods().length === 0 && (
          <div className="text-center py-6 border-t">
            <p className="text-xs text-muted-foreground">
              No moods for this day
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}