// Paste into the DevTools console on https://www.forbes.com/real-time-billionaires/
// It downloads forbes-billionaires.json, which you then import with:
//   node scripts/fetch-billionaires.mjs --file ~/Downloads/forbes-billionaires.json

(() => {
  const list = window.__NEXT_DATA__.props.pageProps.data.billionairesData.billionaires.map(
    (p) => ({
      rank: p.rank,
      personName: p.personName,
      finalWorth: p.finalWorth,
      countryOfCitizenship: p.countryOfCitizenship,
      source: p.source,
      industries: p.industries,
      birthDate: p.birthDate,
    })
  );
  const blob = new Blob([JSON.stringify(list)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "forbes-billionaires.json";
  link.click();
  console.log(`Downloaded ${list.length} billionaires`);
})();
