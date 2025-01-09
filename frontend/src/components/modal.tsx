import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Label } from "@/components/ui/label";
  import { revalidatePath } from "next/cache";
  
  interface UploadDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
  }
  
  const categories = [
    "AI",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "DevOps",
  ];
  
  export function PopUp({ open, setOpen }: UploadDialogProps) {
    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      categories: [] as string[],
      url: "",
    });
  
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Create New Post
            </DialogTitle>
          </DialogHeader>
          <p>hi</p>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }