import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface EditJournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: string;
  categories: string[];
  onSave: (entry: string, categories: string[]) => void;
}

const categoryOptions = ["stress", "grateful", "anxious", "happy", "sad"];

const EditJournalDialog = ({
  open,
  onOpenChange,
  entry,
  categories,
  onSave,
}: EditJournalDialogProps) => {
  const [editedEntry, setEditedEntry] = useState(entry);
  const [editedCategories, setEditedCategories] = useState<string[]>(categories);

  useEffect(() => {
    setEditedEntry(entry);
    setEditedCategories(categories);
  }, [entry, categories, open]);

  const toggleCategory = (category: string) => {
    setEditedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    if (editedEntry.trim()) {
      onSave(editedEntry, editedCategories);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Journal Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <Textarea
            value={editedEntry}
            onChange={(e) => setEditedEntry(e.target.value)}
            placeholder="Edit your journal entry..."
            className="min-h-[120px]"
          />

          <div>
            <p className="text-sm font-medium mb-3 text-foreground">Category Tags</p>
            <div className="grid grid-cols-2 gap-3">
              {categoryOptions.map((category) => (
                <FieldGroup key={category}>
                  <Field orientation="horizontal">
                    <Checkbox
                      id={`edit-${category}`}
                      checked={editedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <FieldLabel htmlFor={`edit-${category}`} className="capitalize">
                      {category}
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!editedEntry.trim()}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditJournalDialog;