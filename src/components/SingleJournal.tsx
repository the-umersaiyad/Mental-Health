import { Pencil, Trash2, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import EditJournalDialog from "./EditJournalDialog";
import { Badge } from "./ui/badge";
const CATEGORY_OPTIONS = [
  {
    value: "stress",
    label: "Stress",
    color: "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    value: "grateful",
    label: "Grateful",
    color:
      "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    value: "anxious",
    label: "Anxious",
    color:
      "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    value: "happy",
    label: "Happy",
    color:
      "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    value: "sad",
    label: "Sad",
    color:
      "bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
];
interface Journal {
  id: string;
  entry: string;
  categories: string[];
  timestamp: string;
}

interface SingleJournalProps {
  journal: Journal;
  onDelete: (id: string) => void;
  onUpdate: (id: string, entry: string, categories: string[]) => void;
}

const SingleJournal = ({ journal, onDelete, onUpdate }: SingleJournalProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    onDelete(journal.id);
    setDeleteDialogOpen(false);
  };

  const getCategoryColor = (category: string) => {
    return (
      CATEGORY_OPTIONS.find((c) => c.value === category)?.color ||
      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };
  return (
    <>
      <Card className="group gap-0  border border-border/60 hover:border-primary/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardHeader className=" ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="opacity-60" />
                <span className="text-xs font-medium">
                  {new Date(journal.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="opacity-60" />
                <span className="text-xs font-medium">
                  {new Date(journal.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                aria-label="Edit journal"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200 hover:scale-110"
                aria-label="Delete journal"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 mt-3">
          <p className="text-sm leading-relaxed text-foreground/90 font-mono">
            {journal.entry}
          </p>

          {journal.categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {journal.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className={`capitalize text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(category)}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}
          {journal.categories.length === 0 && (
            <Badge variant="outline" className="text-xs px-3 py-1">
              No tags
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <EditJournalDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        entry={journal.entry}
        categories={journal.categories}
        onSave={(entry, categories) => onUpdate(journal.id, entry, categories)}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              journal entry.
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

export default SingleJournal;
