import fs from "fs";
import path from "path";

export interface Label {
  labels: string[];
  links: { [key: string]: string };
}

const registries: { [chain: string]: Label } = {};

const filenames = fs.readdirSync(path.join(__dirname, "labels"));

for (const filename of filenames) {
  const buff = fs.readFileSync(
    path.join(__dirname, "labels", filename),
    "utf8"
  );
  const label = JSON.parse(buff);

  const address = filename.split(".")[0];

  registries[address] = label;
}

/**
 * @param address lowercase hex string. ex: "0x0000000000000000000000000000000000000000"
 */
export function getLabel(address: string) {
  return registries[address];
}
