import "server-only";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { files_table, folders_table } from "./schema";

export const QUERIES = {
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;

    while (currentId !== null) {
      const folder = await db
        .select()
        .from(folders_table)
        .where(eq(folders_table.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }

      parents.push(folder[0]);
      currentId = folder[0].parent;
    }

    return parents;
  },

  getFolders: function (folderId: number) {
    return db
      .select()
      .from(folders_table)
      .where(eq(folders_table.parent, folderId));
  },

  getFiles: function (folderId: number) {
    return db
      .select()
      .from(files_table)
      .where(eq(files_table.parent, folderId));
  },
  getFolderById: async function (folderId: number) {
    const folder = await db
      .select()
      .from(folders_table)
      .where(eq(folders_table.id, folderId));
    return folder[0];
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return db.insert(files_table).values({
      ...input.file,
      ownerId: input.userId,
    });
  },
};
