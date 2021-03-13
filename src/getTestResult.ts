import { spawn } from "child_process";

export function getTestResult(testOptions?: string[]) {
  console.log("----------------- TEST ------------------");
  const test = spawn("npm", ["test", "--", ...(testOptions ?? [])]);
  test.stderr.on("data", (data) => {
    console.error(data.toString());
  });
}
