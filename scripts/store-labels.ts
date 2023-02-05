import fs from "fs";
import path from "path";
import pool from "../src/db/pool";
import { insertLabels, Label } from "../src/db/labels";

async function main() {
  // argv[0]: ts-node
  // argv[1]: store-labels.ts

  const client = await pool.connect();

  const updated_at = new Date();

  // Read all files from "labels" folder
  const src = path.join(__dirname, "..", "labels");

  const labels: Label[] = [];

  fs.readdirSync(src).forEach(function (child) {
    const buffer = fs.readFileSync(
      path.join(__dirname, "..", "labels", child),
      "utf8"
    );
    const [address] = child.split(".json");
    const payload = JSON.parse(buffer);

    if (payload.labels && Array.isArray(payload.labels)) {
      for (const label of payload.labels) {
        labels.push({
          address,
          type: label.type,
          value: label.value,
          updated_at,
        });
      }
    }

    if (payload.links) {
      for (const type in payload.links) {
        labels.push({
          address,
          type,
          value: payload.links[type],
          updated_at,
        });
      }
    }
  });

  await insertLabels(client, labels);

  console.log(`Inserted ${labels.length} labels`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
