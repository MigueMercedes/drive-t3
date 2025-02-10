"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { UTApi } from "uploadthing/server";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";

const utApi = new UTApi();

type OperationResult = {
  success?: boolean;
  error?: string;
  deletedFiles?: number;
  deletedFolders?: number;
};

async function deleteFile(
  fileId: number,
  userId: string,
): Promise<OperationResult> {
  try {
    const [file] = await db
      .select()
      .from(files_table)
      .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, userId)));

    if (!file) {
      return { error: "File not found or unauthorized" };
    }

    const fileKey = file.url.replace("https://utfs.io/f/", "");
    await utApi.deleteFiles([fileKey]);

    await db
      .delete(files_table)
      .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, userId)));

    return { success: true };
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    return { error: `Failed to delete file: ${(error as Error).message}` };
  }
}

export async function deleteFileFromClient(
  fileId: number,
): Promise<OperationResult> {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const result = await deleteFile(fileId, session.userId);

  if (result.success) {
    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));
  }

  return result;
}

async function deleteRecursively(
  folderId: number,
  userId: string,
): Promise<OperationResult> {
  try {
    let deletedFiles = 0;
    let deletedFolders = 0;

    // Get all files
    const files = await db
      .select()
      .from(files_table)
      .where(
        and(eq(files_table.parent, folderId), eq(files_table.ownerId, userId)),
      );

    // Delete all subfolders
    const subfolders = await db
      .select()
      .from(folders_table)
      .where(
        and(
          eq(folders_table.parent, folderId),
          eq(folders_table.ownerId, userId),
        ),
      );

    // Delete all files
    if (files.length > 0) {
      const fileResults = await Promise.allSettled(
        files.map((file) => deleteFile(file.id, userId)),
      );

      deletedFiles = fileResults.filter(
        (result) => result.status === "fulfilled" && result.value.success,
      ).length;
    }

    // Delete all subfolders recursively
    if (subfolders.length > 0) {
      const folderResults = await Promise.allSettled(
        // Call itself to delete subfolders and its contents
        subfolders.map((folder) => deleteRecursively(folder.id, userId)),
      );

      folderResults.forEach((result) => {
        if (result.status === "fulfilled") {
          deletedFiles += result.value.deletedFiles ?? 0;
          deletedFolders += result.value.deletedFolders ?? 0;
        }
      });
    }

    // Delete current folder
    await db
      .delete(folders_table)
      .where(
        and(eq(folders_table.id, folderId), eq(folders_table.ownerId, userId)),
      );
    deletedFolders += 1;

    return {
      success: true,
      deletedFiles,
      deletedFolders,
    };
  } catch (error) {
    console.error(`Error deleting folder ${folderId}:`, error);
    return { error: `Failed to delete folder: ${(error as Error).message}` };
  }
}

export async function deleteFolderFromClient(
  folderId: number,
): Promise<OperationResult> {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  try {
    const [folder] = await db
      .select()
      .from(folders_table)
      .where(
        and(
          eq(folders_table.id, folderId),
          eq(folders_table.ownerId, session.userId),
        ),
      );

    if (!folder) {
      return { error: "Folder not found or unauthorized" };
    }

    const result = await deleteRecursively(folderId, session.userId);

    const c = await cookies();
    c.set("force-refresh", JSON.stringify(Math.random()));

    return {
      success: true,
      deletedFiles: result.deletedFiles,
      deletedFolders: result.deletedFolders,
    };
  } catch (error) {
    console.error(`Error deleting folder ${folderId}:`, error);
    return { error: `Failed to delete folder: ${(error as Error).message}` };
  }
}
