import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SeedDataButton = () => {
  const [status, setStatus] = useState<"idle" | "success" | "cleared">("idle");

  const seedData = () => {
    // Journal categories
    const categories = ["stress", "grateful", "anxious", "happy", "sad"];
    
    // Mood emojis
    const moods = [
      { emoji: "😊", label: "Happy" },
      { emoji: "😢", label: "Sad" },
      { emoji: "😌", label: "Calm" },
      { emoji: "😤", label: "Frustrated" },
      { emoji: "🥰", label: "Loved" },
    ];

    // Sample journal entries
    const journalTemplates = [
      "Had a productive morning working on my project. Feeling accomplished!",
      "Spent quality time with family today. Grateful for these moments.",
      "Work was overwhelming today. Need to practice better time management.",
      "Went for a long walk in the park. Nature always helps clear my mind.",
      "Finished reading an amazing book. It really shifted my perspective.",
      "Had an intense workout session. Feeling energized and strong!",
      "Cooked a new recipe for dinner. It turned out better than expected.",
      "Video call with old friends. Laughing together was exactly what I needed.",
      "Struggled with anxiety today but managed to practice some breathing exercises.",
      "Received positive feedback at work. Hard work is paying off!",
      "Felt a bit lonely today. Need to reach out and connect more.",
      "Morning meditation session was particularly peaceful today.",
      "Tackled a challenging problem at work. Proud of the solution I found.",
      "Spent the evening journaling and reflecting on my goals.",
      "Had a disagreement with a colleague. Need to work on communication.",
      "Discovered a new coffee shop. Sometimes small joys matter most.",
      "Feeling under the weather today. Taking it easy and resting.",
      "Volunteered at the local community center. Helping others feels rewarding.",
      "Started learning something new. Excited about the journey ahead!",
      "Had a lazy Sunday. Sometimes doing nothing is the best thing.",
      "Dealt with some technical issues today. Frustrating but learned a lot.",
      "Caught up on sleep finally. Feeling refreshed and ready.",
      "Had a heart-to-heart conversation. Vulnerability brings us closer.",
      "Organized my workspace. A clean space really does help productivity.",
      "Treated myself to something special. Self-care isn't selfish.",
      "Faced a fear today. Small steps lead to big changes.",
      "Felt overwhelmed by responsibilities. Need to prioritize better.",
      "Celebrated a small win. Every achievement deserves recognition.",
      "Practiced gratitude today. Focusing on what I have, not what I lack.",
      "Had a creative breakthrough. Sometimes inspiration strikes unexpectedly.",
    ];

    // Generate 30 journal entries for January 2025
    const journalEntries = [];
    let journalTemplateIndex = 0;
    
    for (let day = 1; day <= 31; day++) {
      const entriesPerDay = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < entriesPerDay && journalEntries.length < 30; i++) {
        const hour = 8 + Math.floor(Math.random() * 14);
        const minute = Math.floor(Math.random() * 60);
        const timestamp = new Date(2025, 0, day, hour, minute).toISOString();
        
        const numCategories = Math.floor(Math.random() * 3) + 1;
        const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);
        const selectedCategories = shuffledCategories.slice(0, numCategories);
        
        journalEntries.push({
          id: `journal-${Date.now()}-${journalEntries.length}`,
          entry: journalTemplates[journalTemplateIndex % journalTemplates.length],
          categories: selectedCategories,
          timestamp: timestamp,
        });
        
        journalTemplateIndex++;
      }
    }

    // Generate 50 mood entries for January 2025
    const moodEntries = [];
    
    for (let day = 1; day <= 31; day++) {
      const moodsPerDay = Math.random() < 0.2 ? 1 : Math.floor(Math.random() * 4) + 1;
      
      for (let i = 0; i < moodsPerDay && moodEntries.length < 50; i++) {
        const hour = 7 + Math.floor(Math.random() * 16);
        const minute = Math.floor(Math.random() * 60);
        const timestamp = new Date(2025, 0, day, hour, minute).toISOString();
        
        const selectedMood = moods[Math.floor(Math.random() * moods.length)];
        
        moodEntries.push({
          id: `mood-${Date.now()}-${moodEntries.length}`,
          entry: selectedMood.label,
          mood: selectedMood.emoji,
          timestamp: timestamp,
        });
      }
    }

    // Save to localStorage
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
    localStorage.setItem("moodEntries", JSON.stringify(moodEntries));

    // Dispatch events to update UI
    window.dispatchEvent(
      new CustomEvent("journalUpdated", { detail: journalEntries })
    );
    window.dispatchEvent(
      new CustomEvent("moodUpdated", { detail: moodEntries })
    );

    setStatus("success");
    setTimeout(() => setStatus("idle"), 5000);
  };

  const clearAllData = () => {
    localStorage.removeItem("journalEntries");
    localStorage.removeItem("moodEntries");
    
    window.dispatchEvent(new CustomEvent("journalUpdated", { detail: [] }));
    window.dispatchEvent(new CustomEvent("moodUpdated", { detail: [] }));
    
    setStatus("cleared");
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Seed Sample Data
        </CardTitle>
        <CardDescription>
          Populate your app with sample journal entries and mood data for January 2025
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button onClick={seedData} className="flex-1" size="lg">
            <Database className="mr-2 h-4 w-4" />
            Load Sample Data
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all journal entries and mood data from your local storage. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearAllData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {status === "success" && (
          <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-emerald-700 dark:text-emerald-400">
              Successfully loaded 30 journal entries and 50 mood entries for January 2025!
            </AlertDescription>
          </Alert>
        )}

        {status === "cleared" && (
          <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-700 dark:text-orange-400">
              All data has been cleared from local storage.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-1 pt-2">
          <p>• 30 journal entries with various categories</p>
          <p>• 50 mood entries with different emotions</p>
          <p>• Distributed across January 2025</p>
          <p>• 2-3 entries per day for journals</p>
          <p>• 3-4 moods per day for mood tracking</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeedDataButton;