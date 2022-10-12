// Read all files from "labels" folder using webpack
// and create a mapping of address - labels
function requireAll(requireContext: any) {
  const keys = requireContext.keys();
  const values = keys.map(requireContext);
  const registry: { [chain: string]: AddressLabels } = {};

  for (let i = 0; i < keys.length; i++) {
    const addressWithoutExtension = keys[i].split(".json")[0];
    const addressWithoutSlashes = addressWithoutExtension.split("/");
    const address = addressWithoutSlashes[addressWithoutSlashes.length - 1];

    registry[address] = values[i];
  }

  return registry;
}

const registry: { [key: string]: AddressLabels } = requireAll(
  require.context("./labels", false, /.json$/)
);

export interface Label {
  type: "info" | "warning" | "danger";
  value: string;
}

type SocialLabel = "twitter" | "telegram" | "github";

export interface AddressLabels {
  labels: Label[];
  links: { [k in SocialLabel]: string };
}

/**
 * @param address lowercase hex string. ex: "0x0000000000000000000000000000000000000000"
 */
export function getLabel(address: string) {
  return registry[address];
}
