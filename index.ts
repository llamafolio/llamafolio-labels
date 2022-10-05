import fs from "fs";
import path from "path";

export function getLabel(address: string) {
  const filename = path.join(
    __dirname,
    "labels",
    address.toLowerCase() + ".json"
  );

  const exists = fs.existsSync(filename);
  if (!exists) {
    return null;
  }

  const buff = fs.readFileSync(filename, "utf8");
  return JSON.parse(buff);
}
