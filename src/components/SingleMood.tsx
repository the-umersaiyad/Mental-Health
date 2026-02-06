import { Trash2, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MoodEntry {
  id: string;
  entry: string;
  mood: string;
  timestamp: string;
}

interface SingleMoodProps {
  mood: MoodEntry;
  onDelete: (id: string) => void;
}

const MOOD_LABELS: Record<string, string> = {
  "😊": "Happy",
  "😢": "Sad",
  "😌": "Calm",
  "😤": "Frustrated",
  "🥰": "Loved",
};

const MOOD_COLORS: Record<string, string> = {
  "😊": "bg-emerald-100/75 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "😢": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "😌": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "😤": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "🥰": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const SingleMood = ({ mood, onDelete }: SingleMoodProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(mood.id);
    setDeleteDialogOpen(false);
  };

  const moodLabel = MOOD_LABELS[mood.mood] || "Unknown";
  const moodColor =
    MOOD_COLORS[mood.mood] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";

  return (
    <>
      <Card className="group  border border-border/60 hover:border-primary/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{mood.mood}</span>
                <Badge
                  variant="secondary"
                  className={`capitalize text-xs px-3 py-1 rounded-full font-medium ${moodColor}`}
                >
                  {moodLabel}
                </Badge>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-110"
              aria-label="Delete mood"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground mt-2">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="opacity-60" />
              <span className="text-xs font-medium">
                {new Date(mood.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="opacity-60" />
              <span className="text-xs font-medium">
                {new Date(mood.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </CardHeader>

        {/* <CardContent className="">
          <p className="text-sm leading-relaxed text-foreground/90 font-light">
            {mood.entry}
          </p>
        </CardContent> */}
      </Card>

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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SingleMood;
