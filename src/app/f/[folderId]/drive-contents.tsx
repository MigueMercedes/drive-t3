"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateFolderButton from "~/components/CreateFolderButton";
import { UploadButton } from "~/components/Uploadthing";
import type { files_table, folders_table } from "~/server/db/schema";
import { FileRow, FolderRow } from "./file-row";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}) {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm">
            <ol className="flex items-center">
              <li>
                <Link
                  className="text-gray-300 transition-colors hover:text-white"
                  href="/f"
                >
                  My Drive
                </Link>
              </li>
              {props.parents.map((folder) => (
                <li key={folder.id} className="flex items-center">
                  <ChevronRight
                    className="mx-2 text-gray-400"
                    size={14}
                    aria-hidden="true"
                  />
                  <Link
                    className="text-gray-300 transition-colors hover:text-white"
                    href={`/f/${folder.id}`}
                  >
                    {folder.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Create folder */}
            <CreateFolderButton parentId={props.currentFolderId} />

            {/* Authentication Buttons */}
            <div>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>

        <UploadButton
          className="mt-4"
          endpoint={"driveUploader"}
          onClientUploadComplete={() => navigate.refresh()}
          input={{ folderId: props.currentFolderId }}
        />
      </div>
    </div>
  );
}
