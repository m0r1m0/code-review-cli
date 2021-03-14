import yargs from "yargs";
import { ESLint } from "eslint";
import { getFilesChanged } from "./filesChanged";
import { getLinesChanged } from "./linesChanged";
import { getTestResult } from "./getTestResult";

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
  if (resultText.length > 0) {
    console.log(resultText);
  } else {
    console.log("No lint error");
  }
  return results;
}

async function run(args: Args) {
  const filesChanged = getFilesChanged(args.branch);
  getLinesChanged(args.branch);
  await getLintResult(filesChanged.map((v) => v.file));
  getTestResult(args.testOptions?.map((v) => v.toString()));
}

type Args = typeof args;

const args = yargs(process.argv.slice(2)).options({
  branch: {
    type: "string",
    description: "parent branch ex) origin/main",
    demandOption: true,
    alias: "b",
  },
  testOptions: {
    type: "array",
    description: "test options",
    alias: "t",
  },
}).argv;

run(args);
