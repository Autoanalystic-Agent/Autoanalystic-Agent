import fs from "fs";
import * as d3 from "d3";
import path from "path";

interface SummaryStats {
  column: string;
  type: string;
  count: number;
  unique: number;
  missing: number;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  topValues?: { value: string; count: number }[];
}

async function summarizeCSV(filename: string): Promise<SummaryStats[]> {
  const filepath = path.isAbsolute(filename)
  ? filename
  : path.join(process.cwd(), "src", "uploads", filename);
  console.log(filepath)
  const data: Record<string, string>[] = await d3.csv(filepath);

  const summaries: SummaryStats[] = [];

  if (data.length === 0) return summaries;

  const columns = Object.keys(data[0]);

  for (const column of columns) {
    const values = data.map(row => row[column]).filter(v => v !== undefined && v !== "");

    const uniqueValues = Array.from(new Set(values));
    const missing = data.length - values.length;

    const numericalValues = values.map(Number).filter(v => !isNaN(v));
    const isNumeric = numericalValues.length >= values.length * 0.8;

    const summary: SummaryStats = {
      column,
      type: isNumeric ? "numeric" : "categorical",
      count: data.length,
      unique: uniqueValues.length,
      missing,
    };

    if (isNumeric) {
      numericalValues.sort((a, b) => a - b);
      summary.min = numericalValues[0];
      summary.max = numericalValues[numericalValues.length - 1];
      summary.mean = d3.mean(numericalValues) ?? 0;
      summary.median = d3.median(numericalValues) ?? 0;
    } else {
      const freqMap: Record<string, number> = {};
      for (const val of values) {
        freqMap[val] = (freqMap[val] || 0) + 1;
      }
      const sorted = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([value, count]) => ({ value, count }));

      summary.topValues = sorted;
    }

    summaries.push(summary);
  }

  return summaries;
}

// ✅ 여기가 핵심!
export class SummarizeTool {
  /**
   * Returns summary statistics of the given CSV file.
   */
  async summarize(input: {filename: string;}): Promise<SummaryStats[]> {
    console.log(input.filename);
    return await summarizeCSV(input.filename);
  }
}
