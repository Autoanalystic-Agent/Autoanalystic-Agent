// src/tools/loadDataTool.ts
import * as fs from "fs";
import * as path from "path";

export class LoadDataTool {
  public async load({ filePath = "uploads/iris.csv" }: { filePath?: string }): Promise<string> {
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      return `파일이 존재하지 않습니다: ${fullPath}`;
    }

    const csvContent = fs.readFileSync(fullPath, "utf8");
    return csvContent.slice(0, 1000);
  }
}
