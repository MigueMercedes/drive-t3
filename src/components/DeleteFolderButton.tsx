"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { deleteFolderFromClient } from "~/server/actions";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";

export function DeleteFolderButton({ folderId }: { folderId: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this folder and all its contents?",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteFolderFromClient(folderId);

      if (result.success) {
        toast.success(
          `Successfully deleted ${result.deletedFiles} files and ${result.deletedFolders} folders`,
        );
      } else {
        toast.error(result.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to delete folder");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant={"ghost"}
      onClick={handleDelete}
      aria-label="Delete folder"
      disabled={isDeleting}
    >
      {isDeleting ? (
        <span className="animate-spin">🔄</span>
      ) : (
        <Trash2Icon size={20} />
      )}
    </Button>
  );
}
