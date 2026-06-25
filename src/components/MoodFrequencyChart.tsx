import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface MoodEntry {
  id: string;
  entry: string;
  mood: string;
  timestamp: string;
}

type ChartViewMode = "frequency" | "daily";
type DailyPeriod = "7days" | "30days" | "custom";

const MOODS = [
  { emoji: "😊", label: "Happy", key: "happy", color: "hsl(142, 76%, 36%)" },
  { emoji: "😢", label: "Sad", key: "sad", color: "hsl(217, 91%, 60%)" },
  { emoji: "😌", label: "Calm", key: "calm", color: "hsl(271, 91%, 65%)" },
  {
    emoji: "😤",
    label: "Frustrated",
    key: "frustrated",
    color: "hsl(0, 84%, 60%)",
  },
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
  const [timePeriod, setTimePeriod] = useState<"all" | "weekly" | "monthly">("all");
  const [chartView, setChartView] = useState<ChartViewMode>("frequency");
  const [dailyPeriod, setDailyPeriod] = useState<DailyPeriod>("7days");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  const getFilteredEntries = () => {
    const now = new Date();
    switch (timePeriod) {
      case "weekly":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entries.filter((e) => new Date(e.timestamp) >= weekAgo);
      case "monthly":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return entries.filter((e) => new Date(e.timestamp) >= monthAgo);
      default:
        return entries;
    }
  };

  const filteredEntries = getFilteredEntries();

  const getFrequencyChartData = (entries: MoodEntry[]) => {
    return MOODS.map((mood) => {
      const count = entries.filter((e) => e.mood === mood.emoji).length;
      return {
        mood: `${mood.emoji} ${mood.label}`,
        count: count,
        fill: mood.color,
      };
    });
  };

  const getDailyChartData = (entries: MoodEntry[], period: DailyPeriod, startDate?: string, endDate?: string) => {
    const today = startOfDay(new Date());

    let daysArray: Array<{ dateObj: Date; dateKey: string; label: string }> = [];

    if (period === "custom" && startDate && endDate) {
      // Custom date range
      const start = startOfDay(new Date(startDate));
      const end = startOfDay(new Date(endDate));
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

      daysArray = Array.from({ length: diffDays }, (_, i) => {
        const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        return {
          dateObj: date,
          dateKey: format(date, "yyyy-MM-dd"),
          label: format(date, "MMM d"),
        };
      });
    } else if (period === "30days") {
      // Last 30 days
      daysArray = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(today, 29 - i);
        return {
          dateObj: date,
          dateKey: format(date, "yyyy-MM-dd"),
          label: format(date, "MMM d"),
        };
      });
    } else {
      // Default: Last 7 days
      daysArray = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i);
        return {
          dateObj: date,
          dateKey: format(date, "yyyy-MM-dd"),
          label: format(date, "MMM d"),
        };
      });
    }

    return daysArray.map(({ dateKey, label }) => {
      const daysEntries = entries.filter((entry) => {
        const entryDate = format(new Date(entry.timestamp), "yyyy-MM-dd");
        return entryDate === dateKey;
      });

      const dataPoint: Record<string, string | number> = { date: label };

      MOODS.forEach((mood) => {
        dataPoint[mood.key] = daysEntries.filter((e) => e.mood === mood.emoji).length;
      });

      return dataPoint;
    });
  };

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

  // Set default custom dates when switching to custom period
  useEffect(() => {
    if (dailyPeriod === "custom") {
      if (!customStartDate || !customEndDate) {
        const today = new Date();
        const thirtyDaysAgo = subDays(today, 29);
        setCustomEndDate(format(today, "yyyy-MM-dd"));
        setCustomStartDate(format(thirtyDaysAgo, "yyyy-MM-dd"));
      }
    }
  }, [dailyPeriod]);

  // Get entry count for the selected period
  const getDailyPeriodEntryCount = () => {
    if (dailyPeriod === "custom" && customStartDate && customEndDate) {
      const start = startOfDay(new Date(customStartDate));
      const end = startOfDay(new Date(customEndDate));
      return entries.filter((e) => {
        const entryDate = startOfDay(new Date(e.timestamp));
        return entryDate >= start && entryDate <= end;
      }).length;
    } else if (dailyPeriod === "30days") {
      const thirtyDaysAgo = subDays(startOfDay(new Date()), 30);
      return entries.filter((e) => new Date(e.timestamp) >= thirtyDaysAgo).length;
    } else {
      // 7 days
      const sevenDaysAgo = subDays(startOfDay(new Date()), 7);
      return entries.filter((e) => new Date(e.timestamp) >= sevenDaysAgo).length;
    }
  };

  const chartData = chartView === "frequency"
    ? getFrequencyChartData(filteredEntries)
    : getDailyChartData(entries, dailyPeriod, customStartDate, customEndDate);

  return (
    <Card className="overflow-hidden border-border/60 shadow-lg">
      <CardHeader className="">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {chartView === "frequency" ? "Mood Frequency" : "Daily Trends"}
              </CardTitle>
              <CardDescription className="mt-1">
                {chartView === "frequency"
                  ? "Track how often you experience each mood"
                  : dailyPeriod === "7days"
                  ? "See your mood distribution over the last 7 days"
                  : dailyPeriod === "30days"
                  ? "See your mood distribution over the last 30 days"
                  : "See your mood distribution over a custom date range"}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              {chartView === "frequency"
                ? `${filteredEntries.length} ${filteredEntries.length === 1 ? "entry" : "entries"}`
                : `${getDailyPeriodEntryCount()} ${getDailyPeriodEntryCount() === 1 ? "entry" : "entries"}`
              }
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {chartView === "frequency" && (
              <Select
                value={timePeriod}
                onValueChange={(value: "all" | "weekly" | "monthly") => setTimePeriod(value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            )}
            {chartView === "daily" && (
              <>
                <Select
                  value={dailyPeriod}
                  onValueChange={(value: DailyPeriod) => setDailyPeriod(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                {dailyPeriod === "custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="border border-input rounded-md px-2 py-1.5 text-sm bg-background w-[115px] focus:outline-none focus:ring-2 focus:ring-ring"
                      max={customEndDate || format(new Date(), "yyyy-MM-dd")}
                    />
                    <span className="text-xs text-muted-foreground">to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="border border-input rounded-md px-2 py-1.5 text-sm bg-background w-[115px] focus:outline-none focus:ring-2 focus:ring-ring"
                      min={customStartDate}
                      max={format(new Date(), "yyyy-MM-dd")}
                    />
                  </div>
                )}
              </>
            )}
            <Select value={chartView} onValueChange={(value: ChartViewMode) => setChartView(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frequency">Frequency</SelectItem>
                <SelectItem value="daily">Daily Trends</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {chartView === "frequency" ? (
          filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4 opacity-20">📊</div>
              <p className="text-muted-foreground text-sm">
                {timePeriod === "all"
                  ? "No mood entries yet. Start tracking your mood to see statistics!"
                  : `No mood entries in the selected ${timePeriod} period.`}
              </p>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-[420px] w-full -ml-5 "
            >
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
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ChartContainer>
          )
        ) : getDailyPeriodEntryCount() === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4 opacity-20">📅</div>
            <p className="text-muted-foreground text-sm">
              {dailyPeriod === "7days"
                ? "No mood entries in the last 7 days. Start tracking your mood to see daily trends!"
                : dailyPeriod === "30days"
                ? "No mood entries in the last 30 days. Start tracking your mood to see daily trends!"
                : "No mood entries in the selected date range. Try a different range!"}
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[420px] w-full -ml-5 "
          >
            <BarChart data={chartData} className="">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
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
              <Legend />
              <Bar dataKey="happy" stackId="moods" fill="hsl(142, 76%, 36%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="sad" stackId="moods" fill="hsl(217, 91%, 60%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="calm" stackId="moods" fill="hsl(271, 91%, 65%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="frustrated" stackId="moods" fill="hsl(0, 84%, 60%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="loved" stackId="moods" fill="hsl(328, 86%, 70%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
