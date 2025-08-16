import supabase, { supabaseUrl } from "./supabase";
import { UAParser } from "ua-parser-js";
export async function getClicksForUrls(urlIds) {
    const { data, error } = await supabase.from("clicks").select("*").in("url_id",urlIds);
   

    if (error) {
        console.error(error.message);
        throw new Error("Unable to load Clicks");
    }

    return data;
}

const parser = new UAParser();



export const storeClicks = async ({ id, originalUrl }) => {
  try {
    // 1. Get device info
    const res = parser.getResult();
    const device = res.type || "desktop";

    // 2. Get location info (IP-based)
    let city = null;
    let country = null;
    try {
      const response = await fetch("https://ipapi.co/json");
      const locationData = await response.json();
      city = locationData.city;
      country = locationData.country_name;
    } catch (locError) {
      console.warn("Unable to fetch location info:", locError);
    }

    // 3. Insert click record into Supabase (ignore failures)
    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
      created_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error recording click:", error);
  }

  // 4. Return the original URL to let the component handle redirect
  return originalUrl;
};

export async function getClicksForUrl(url_id) {
    const { data, error } = await supabase.from("clicks")
    .select("*")
    .eq("url_id",url_id);
    

    if (error) {
        console.error(error.message);
        throw new Error("unable to load stats");
    }

    return data;
}