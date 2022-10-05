// Read all files from "labels" folder using webpack
// and create a mapping of address - labels
function requireAll(requireContext: any) {
  const keys = requireContext.keys();
  const values = keys.map(requireContext);
  const registry: { [chain: string]: Label } = {};

  for (let i = 0; i < keys.length; i++) {
    const addressWithoutExtension = keys[i].split(".json")[0];
    const addressWithoutSlashes = addressWithoutExtension.split("/");
    const address = addressWithoutSlashes[addressWithoutSlashes.length - 1];

    registry[address] = values[i];
  }

  return registry;
}

const registry: { [key: string]: Label } = requireAll(
  require.context("./labels", false, /.json$/)
);

export interface Label {
  labels: string[];
  links: { [key: string]: string };
}

/**
 * @param address lowercase hex string. ex: "0x0000000000000000000000000000000000000000"
 */
export function getLabel(address: string) {
  return registry[address];
}
