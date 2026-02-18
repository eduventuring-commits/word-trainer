import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { MorphologyDataset, GradeBand, Focus } from "@/lib/types";
import { filterCards, shuffleCards } from "@/lib/filterCards";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gradeBand = (searchParams.get("gradeBand") ?? "All") as
    | GradeBand
    | "All";
  const focus = (searchParams.get("focus") ?? "Mixed") as Focus;

  try {
    const filePath = path.join(process.cwd(), "data", "morphology_dataset.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const dataset = JSON.parse(raw) as MorphologyDataset;

    const filtered = filterCards(dataset.wordCards, gradeBand, focus);
    const shuffled = shuffleCards(filtered);

    return NextResponse.json({ cards: shuffled, total: shuffled.length });
  } catch (err) {
    console.error("Failed to load dataset:", err);
    return NextResponse.json(
      { error: "Failed to load word cards." },
      { status: 500 }
    );
  }
}
