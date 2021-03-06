import { execSync } from "child_process";

interface LinesChanged {
  insertions: number;
  deletions: number;
}

export function getLinesChanged(branch: string): LinesChanged {
  const result = execSync(
    `git log --numstat ${branch}..HEAD | awk 'NF==3 {plus+=\$1;minus+=\$2;} END {printf("+\%d -\%d", plus, minus)}'`
  );
  console.log(`--- [${branch}..HEAD] Lines changed ---`);
  const resultText = result.toString();
  console.log(resultText);
  const [insertions, deletions] = resultText.split("\n");
  return {
    insertions: Number(insertions),
    deletions: Number(deletions),
  };
}
