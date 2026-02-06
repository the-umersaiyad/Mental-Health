import { useState, useEffect } from "react";
import SingleJournal from "./SingleJournal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";

interface JournalEntry {
  id: string;
  entry: string;
  categories: string[];
  timestamp: string;
}

const CATEGORY_OPTIONS = [
  {
    value: "stress",
    label: "Stress",
    color: "bg-red-100/50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
  },
  {
    value: "grateful",
    label: "Grateful",
    color: "bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
  },
  {
    value: "anxious",
    label: "Anxious",
    color: "bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
  },
  {
    value: "happy",
    label: "Happy",
    color: "bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
  },
  {
    value: "sad",
    label: "Sad",
    color: "bg-purple-100/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
  }
];

const ManageJournals = () => {
  const [entryText, setEntryText] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [saved, setSaved] = useState<boolean>(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error("Error parsing journal entries:", error);
        setEntries([]);
      }
    }
  }, []);

  // Dispatch custom event when entries change
  const updateEntriesAndNotify = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem("journalEntries", JSON.stringify(newEntries));
    // Dispatch custom event for same-page updates
    window.dispatchEvent(
      new CustomEvent("journalUpdated", { detail: newEntries }),
    );
  };

  const handleCategoryToggle = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSave = () => {
    if (entryText.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        entry: entryText,
        categories,
        timestamp: new Date().toISOString(),
      };
      const updatedEntries = [newEntry, ...entries];
      updateEntriesAndNotify(updatedEntries);
      setSaved(true);
      setEntryText("");
      setCategories([]);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter((e) => e.id !== id);
    updateEntriesAndNotify(updatedEntries);
  };

  const handleUpdate = (
    id: string,
    updatedEntry: string,
    updatedCategories: string[],
  ) => {
    const updatedEntries = entries.map((e) =>
      e.id === id
        ? { ...e, entry: updatedEntry, categories: updatedCategories }
        : e,
    );
    updateEntriesAndNotify(updatedEntries);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDE - Form */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Hero Image */}
            <Card className="overflow-hidden border-0 shadow-md p-0">
              <img
                src="img/colorful-overloaded-bullet-journal.jpg"
                alt="journal"
                className="w-full h-auto object-cover transition-all duration-300 dark:brightness-75"
              />
            </Card>

            {/* Form Section */}
            <Card className="overflow-hidden border-border/60 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">New Journal Entry</CardTitle>
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
                    Write your thoughts
                  </p>
                  <Textarea
                    placeholder="Write your journal entry here..."
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    className="min-h-[160px] resize-none"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Category Tags
                  </p>
                  <div className="flex flex-wrap  gap-5">
                    {CATEGORY_OPTIONS.map((category) => (
                      <label
                        key={category.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          id={category.value}
                          checked={categories.includes(category.value)}
                          onCheckedChange={() => handleCategoryToggle(category.value)}
                        />
                        <span className="text-sm capitalize">
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleSave}
                  disabled={!entryText.trim()}
                  className="w-full"
                  size="lg"
                >
                  Save Entry
                </Button>

                {saved && (
                  <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <AlertDescription className="text-emerald-700 dark:text-emerald-400">
                      Journal entry saved successfully!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - Entries */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Entries Section */}
            <Card className="overflow-hidden border-border/60 shadow-md">
              <CardHeader>
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
                      No entries yet. Start writing!
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[825px] pr-4">
                    <div className="space-y-4">
                      {entries.map((journal) => (
                        <SingleJournal
                          key={journal.id}
                          journal={journal}
                          onDelete={handleDelete}
                          onUpdate={handleUpdate}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJournals;