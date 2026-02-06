import { useEffect, useState } from "react";
import SingleMood from "./SingleMood";
import MoodFrequencyChart from "./MoodFrequencyChart";
import MoodCalendar from "./MoodCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";

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
    color: "bg-emerald-100/50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-900/60",
  },
  { 
    emoji: "😢", 
    label: "Sad", 
    color: "bg-blue-100/50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/60" 
  },
  { 
    emoji: "😌", 
    label: "Calm", 
    color: "bg-purple-100/50  dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/60" 
  },
  { 
    emoji: "😤", 
    label: "Frustrated", 
    color: "bg-red-100/50  dark:bg-red-900/20 border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/60" 
  },
  { 
    emoji: "🥰", 
    label: "Loved", 
    color: "bg-pink-100/50  dark:bg-pink-900/20 border-pink-300 dark:border-pink-700 hover:bg-pink-200 dark:hover:bg-pink-900/60" 
  },
];

const ManageMoods = () => {
  const [selectedMood, setSelectedMood] = useState<string>(MOODS[0].emoji);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  const getMoodLabel = (emoji: string) => {
    return MOODS.find((m) => m.emoji === emoji)?.label || "";
  };

  useEffect(() => {
    const saved = localStorage.getItem("moodEntries");
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing mood entries:", error);
        setEntries([]);
      }
    }
  }, []);

  const updateEntriesAndNotify = (newEntries: MoodEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem("moodEntries", JSON.stringify(newEntries));
    window.dispatchEvent(
      new CustomEvent("moodUpdated", { detail: newEntries })
    );
  };

  const handleSave = () => {
    const moodLabel = getMoodLabel(selectedMood);
    if (moodLabel) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        entry: moodLabel,
        mood: selectedMood,
        timestamp: new Date().toISOString(),
      };
      const updatedEntries = [newEntry, ...entries];
      updateEntriesAndNotify(updatedEntries);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    updateEntriesAndNotify(updated);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDE - Form + Chart */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Hero Image */}
            <Card className="overflow-hidden border-0 shadow-md p-0">
              <img
                src="img/flat-lay-blue-monday-concept-with-copy-space.jpg"
                alt="mood"
                className="w-full h-auto object-cover transition-all duration-300 dark:brightness-75"
              />
            </Card>

            {/* Form Section */}
            <Card className="overflow-hidden border-border/60 shadow-md">
              <CardHeader className="">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">New Mood Entry</CardTitle>
                  {entries.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {entries.length} total
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    How are you feeling?
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {MOODS.map((mood) => (
                      <Button
                        key={mood.emoji}
                        variant="outline"
                        onClick={() => setSelectedMood(mood.emoji)}
                        className={`
                          flex flex-col items-center gap-2 h-auto p-4 border-2 transition-all duration-200
                          ${mood.color}
                          ${
                            selectedMood === mood.emoji
                              ? "ring-2 ring-primary scale-105 shadow-md"
                              : ""
                          }
                        `}
                        aria-label={mood.label}
                      >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className="text-xs font-medium">{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleSave}
                  className="w-full"
                  size="lg"
                >
                  Save Mood
                </Button>

                {saved && (
                  <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <AlertDescription className="text-emerald-700 dark:text-emerald-400">
                      Mood saved successfully!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

           
          </div>

          {/* RIGHT SIDE - Entries + Calendar */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Entries Section */}
            <Card className="overflow-hidden border-border/60 shadow-md">
              <CardHeader className="">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Your Entries</CardTitle>
                  {entries.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {entries.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-6xl mb-4 opacity-20">📝</div>
                    <p className="text-muted-foreground text-sm">
                      No entries yet. Start tracking your mood!
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[595px] pr-4">
                    <div className="space-y-4">
                      {entries.map((mood) => (
                        <SingleMood key={mood.id} mood={mood} onDelete={handleDelete} />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Calendar Popover Button */}
           
          </div>
        </div>
        <div>
        <div className="mt-3 border-border/60 shadow-md rounded-md">
        <MoodCalendar/>
        </div>
         {/* Chart Section */}
         <div className="mt-3 border-border/60 shadow-md rounded-md">
            {entries.length === 0 ? (
              <Card className="overflow-hidden border-border/60 shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-6xl mb-4 opacity-20">📊</div>
                  <p className="text-muted-foreground text-sm">
                    No mood entries yet. Start tracking your mood to see statistics!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <MoodFrequencyChart />
            )}
            </div>
            </div>
      </div>
    </div>
  );
};

export default ManageMoods;
