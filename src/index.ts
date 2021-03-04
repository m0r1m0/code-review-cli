import { exec } from "child_process";
import yargs from "yargs";

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

function run(args: Args) {
  const filesChanged = getFilesChanged(args.branch);
}

type Args = typeof args;

const args = yargs(process.argv.slice(2)).options({
  branch: {
    type: "string",
    description: "parent branch ex) origin/main",
    demandOption: true,
    alias: "b",
  },
}).argv;

run(args);
