import { execSync } from "child_process";
import yargs from "yargs";
import { ESLint } from "eslint";

interface FileChanged {
  status: string;
  file: string;
}

function getFilesChanged(branch: string): FileChanged[] {
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
  console.log("--- [origin/main..HEAD] Files changed ---");
  for (const fileChanged of filesChanged) {
    console.log(`${fileChanged.status}\t${fileChanged.file}`);
  }
  return filesChanged;
}

async function getLintResult(paths: string[]): Promise<ESLint.LintResult[]> {
  const eslint = new ESLint({
    errorOnUnmatchedPattern: false,
  });
  const results = await eslint.lintFiles(
    paths.filter((v) => v.match(/.\.(js|ts|jsx|tsx)$/))
  );
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);
  console.log("---------------- ESLint -----------------");
  console.log(resultText);
  return results;
}

async function run(args: Args) {
  const filesChanged = getFilesChanged(args.branch);
  getLintResult(filesChanged.map((v) => v.file));
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
