// Fetches the latest billionaire list and writes it to data/billionaires.json.
// Run by .github/workflows/update-data.yml on a schedule, or locally with:
//   node scripts/fetch-billionaires.mjs
//
// Forbes's bot protection usually blocks the direct fetch, so the data can
// also be imported from a file saved in your browser (see README):
//   node scripts/fetch-billionaires.mjs --file ~/Downloads/forbes-billionaires.json
//
// The source URL can be overridden with the SOURCE_URL env var. If the fetch
// fails or the data looks wrong, the existing JSON file is left untouched.

import { readFile, writeFile } from "node:fs/promises";

const SOURCE_URL =
  process.env.SOURCE_URL ||
  "https://www.forbes.com/forbesapi/person/rtb/0/position/true.json";
const OUTPUT_PATH = new URL("../data/billionaires.json", import.meta.url);
const MIN_ROWS = 500;

// Names that differ between the data source and the world-atlas map
const COUNTRY_ALIASES = {
  "United States": "United States of America",
};

const ageFromBirthDate = (birthDate) => {
  if (!birthDate) return null;
  const ms = Date.now() - new Date(birthDate).getTime();
  return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
};

// Converts one Forbes record into the shape the visualizations expect
const normalizePerson = (person) => {
  const country = person.countryOfCitizenship || "";
  return {
    rank: person.rank,
    name: person.personName,
    country: COUNTRY_ALIASES[country] || country,
    // Forbes reports finalWorth in millions; the app works in billions
    netWorth: Math.round((person.finalWorth / 1000) * 10) / 10,
    age: person.age ?? ageFromBirthDate(person.birthDate),
    source: person.source,
    industry: Array.isArray(person.industries)
      ? person.industries[0]
      : person.industries,
  };
};

const isValidPerson = (p) =>
  typeof p.name === "string" &&
  p.name.length > 0 &&
  typeof p.country === "string" &&
  p.country.length > 0 &&
  Number.isFinite(p.netWorth) &&
  p.netWorth > 0 &&
  typeof p.industry === "string";

// Accepts the API response, the page's __NEXT_DATA__, or a plain array of people
const extractPeople = (body) => {
  if (Array.isArray(body)) return body;
  return (
    body?.personList?.personsLists ||
    body?.props?.pageProps?.data?.billionairesData?.billionaires
  );
};

const loadSource = async () => {
  const fileIndex = process.argv.indexOf("--file");
  if (fileIndex !== -1) {
    const filePath = process.argv[fileIndex + 1];
    return JSON.parse(await readFile(filePath, "utf8"));
  }

  const res = await fetch(SOURCE_URL, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

const main = async () => {
  const people = extractPeople(await loadSource());
  if (!Array.isArray(people)) {
    throw new Error("Unexpected data shape: no list of billionaires found");
  }

  const billionaires = people
    .map(normalizePerson)
    .filter(isValidPerson)
    .sort((a, b) => b.netWorth - a.netWorth);

  if (billionaires.length < MIN_ROWS) {
    throw new Error(
      `Only ${billionaires.length} valid rows (expected at least ${MIN_ROWS})`
    );
  }

  const output = {
    updatedAt: new Date().toISOString(),
    source: "Forbes Real-Time Billionaires",
    billionaires,
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log(`Wrote ${billionaires.length} billionaires to data/billionaires.json`);
};

main().catch((err) => {
  console.error(`Keeping existing data. ${err.message}`);
  process.exit(1);
});
