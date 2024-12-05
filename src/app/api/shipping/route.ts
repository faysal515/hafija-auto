import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    // Fetch the webpage
    const response = await axios.get(
      "https://autocj.co.jp/japan_shipping?dest=8"
    );
    const html = response.data;
    const $ = cheerio.load(html);

    // Initialize array to store schedule data
    const scheduleData: any[] = [];

    // Select all rows from the shipping table
    $(".ship_c .row").each((index, element) => {
      const columns = $(element).find("td");

      // Extract data from each column
      const rowData = {
        company: $(columns[0]).text().trim(),
        shipName: $(columns[1]).text().trim(),
        voyage: $(columns[2]).text().trim(),
        yokohama: $(columns[3]).text().replace(/\s+/g, " ").trim(),
        // kawasaki: $(columns[4]).text().trim(),
        nagoya: $(columns[5]).text().replace(/\s+/g, " ").trim(),
        // kobe: $(columns[6]).text().trim(),
        osaka: $(columns[7]).text().replace(/\s+/g, " ").trim(),
        // hakata: $(columns[8]).text().trim(),
        // kanda: $(columns[9]).text().trim(),
        // kisarazu: $(columns[10]).text().trim(),
        // hitachinaka: $(columns[11]).text().trim(),
        // hongKong: $(columns[12]).text().trim(),
        // laemChabang: $(columns[13]).text().trim(),
        // hambantota: $(columns[14]).text().trim(),
        chittagong: $(columns[15]).text().replace(/\s+/g, " ").trim(),
        mongla: $(columns[16]).text().replace(/\s+/g, " ").trim(),
        // subic: $(columns[17]).text().trim(),
      };

      scheduleData.push(rowData);
    });

    // Return the data as JSON
    return NextResponse.json({
      success: true,
      data: scheduleData,
    });
  } catch (error) {
    console.error("Error fetching shipping schedule:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shipping schedule",
      },
      { status: 500 }
    );
  }
}
