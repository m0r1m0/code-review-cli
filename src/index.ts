import { exec } from "child_process";

interface FileChanged {
  status: string;
  file: string;
}

function getFilesChanged(branch: string): FileChanged[] {
  exec(`git diff --name-status ${branch}..HEAD`, (err, stdout) => {
    if (!err) {
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
      console.log("--- [origin/main..HEAD] Files changed ---");
      for (const fileChanged of filesChanged) {
        console.log(`${fileChanged.status}\t${fileChanged.file}`);
      }
      return filesChanged;
    }
  });
  return [];
}

function run(args: string[]) {
  const branch = args.length > 0 ? args[0] : undefined;
  if (branch !== undefined) {
    const filesChanged = getFilesChanged(branch);
  }
}

run(process.argv.slice(2));
