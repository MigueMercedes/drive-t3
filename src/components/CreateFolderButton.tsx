"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { createFolderFromClient } from "~/server/actions";
import { Button } from "./ui/button";

export default function CreateFolderButton(props: { parentId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const folderName = prompt("Enter the name of the new folder");

    if (!folderName) return;

    startTransition(async () => {
      try {
        const result = await createFolderFromClient(props.parentId, folderName);

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Folder created successfully");
        }
      } catch (error) {
        console.error("Error creating folder:", error);
        toast.error("An error occurred while creating the folder.");
      }
    });
  };

  return (
    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleClick} disabled={isPending}>
      {isPending ? <span className="animate-spin">🔄</span> : "Add new folder"}
    </Button>
  );
}
