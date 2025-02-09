import { QUERIES } from "~/server/db/queries";
import DriveContents from "../../drive-contents";
import { auth } from "@clerk/nextjs/server";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await props.params;

  const parsedFolderId = parseInt(folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
  ]);

  console.log((await auth()))

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
