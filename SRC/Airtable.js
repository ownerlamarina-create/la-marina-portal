const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

export const TABLES = {
  investors: "INVESTORS",
  assets: "ASSETS",
  reservations: "RESERVATIONS",
  payouts: "PAYOUT",
  maintenance: "MAINTENANCE LOG",
  statements: "MONTHLY STATEMENT",
};

export async function fetchTable(tableName) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
  const data = await res.json();
  return data.records || [];
}

export async function fetchAllTables() {
  const [investors, assets, reservations, payouts, maintenance, statements] = await Promise.all([
    fetchTable(TABLES.investors),
    fetchTable(TABLES.assets),
    fetchTable(TABLES.reservations),
    fetchTable(TABLES.payouts),
    fetchTable(TABLES.maintenance),
    fetchTable(TABLES.statements),
  ]);
  return { investors, assets, reservations, payouts, maintenance, statements };
}
