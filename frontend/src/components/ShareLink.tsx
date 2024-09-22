import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { toast } from "@/hooks/use-toast";

export function ShareLink() {
  const url=window.location.origin;

  const [linkId, setLinkId] = useState("");

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Trigger the generatedId function when the Dialog opens
  const handleDialogOpen = (isOpen: boolean) => {
    if (isOpen) {
      const newId = generateId(); // Generate new ID when Dialog opens
      setLinkId(newId); // This will trigger a re-render with the new ID
    }
  };

  const handleCopyClick = () => {
    const link = `${url}/rtwhiteboard/session/${linkId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        toast({
            title: "Copy to Clipboard!",
            description: `${link}`,
          })
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-indigo-200 shadow-md text-gray-500 hover:bg-indigo-300 hover:text-black"
        >
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={`${url}/rtwhiteboard/session/${linkId}`}
              readOnly
            />
          </div>
          <Button onClick={handleCopyClick} type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
