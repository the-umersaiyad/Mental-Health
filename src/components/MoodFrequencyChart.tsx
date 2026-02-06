import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type{
  ChartConfig,

} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface MoodEntry {
  id: string;
  entry: string;
  mood: string;
  timestamp: string;
}

const MOODS = [
  { emoji: "😊", label: "Happy", key: "happy", color: "hsl(142, 76%, 36%)" },
  { emoji: "😢", label: "Sad", key: "sad", color: "hsl(217, 91%, 60%)" },
  { emoji: "😌", label: "Calm", key: "calm", color: "hsl(271, 91%, 65%)" },
  { emoji: "😤", label: "Frustrated", key: "frustrated", color: "hsl(0, 84%, 60%)" },
  { emoji: "🥰", label: "Loved", key: "loved", color: "hsl(328, 86%, 70%)" },
];

const chartConfig = {
  happy: {
    label: "Happy",
    color: "hsl(142, 76%, 36%)",
  },
  sad: {
    label: "Sad",
    color: "hsl(217, 91%, 60%)",
  },
  calm: {
    label: "Calm",
    color: "hsl(271, 91%, 65%)",
  },
  frustrated: {
    label: "Frustrated",
    color: "hsl(0, 84%, 60%)",
  },
  loved: {
    label: "Loved",
    color: "hsl(328, 86%, 70%)",
  },
} satisfies ChartConfig;

export default function MoodFrequencyChart() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

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

  const chartData = MOODS.map((mood) => {
    const count = entries.filter((e) => e.mood === mood.emoji).length;
    return {
      mood: `${mood.emoji} ${mood.label}`,
      count: count,
      fill: mood.color,
    };
  });

  return (
    <Card className="overflow-hidden border-border/60 shadow-lg">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Mood Frequency</CardTitle>
            <CardDescription className="mt-1">
              Track how often you experience each mood
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4 opacity-20">📊</div>
            <p className="text-muted-foreground text-sm">
              No mood entries yet. Start tracking your mood to see statistics!
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[420px] w-full -ml-5 ">
            <BarChart data={chartData} className="">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="mood"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
