import { execSync } from "child_process";

interface FileChanged {
  status: string;
  file: string;
}

export function getFilesChanged(branch: string): FileChanged[] {
  const result = execSync(`git diff --name-status ${branch}..HEAD`);
  const stdout = result.toString();
  const changes = stdout.split("\n");
  const filesChanged: FileChanged[] = changes
    .map((c) => {
      const [status, file] = c.split("\t");
      return {
        status,
        file,
      };
    })
    .filter((v) => v.status !== "" && v.file !== undefined);
  console.log(`--- [${branch}..HEAD] Files changed ---`);
  for (const fileChanged of filesChanged) {
    console.log(`${fileChanged.status}\t${fileChanged.file}`);
  }
  if (filesChanged.length === 0) {
    console.log("No file changed");
  }
  return filesChanged;
}
