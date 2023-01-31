import twitterLabels from "./twitter-labels.json";

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
  address: string
  labels: Label[];
  links: { [k in SocialLabel]: string };
}

/**
 * @param address lowercase hex string. ex: "0x0000000000000000000000000000000000000000"
 */
export function getLabel(address: string, ensName?: string): AddressLabels {
  const registryLabels = registry[address];

  const labelt = {
    address,
    links: registryLabels?.links ?? {},
    labels: registryLabels?.labels ?? [],
  };

  if (ensName) {
    const twitter = (twitterLabels as { name: string; handle: string }[]).find(
      (twitter) => twitter.name === ensName
    );

    if (twitter) {
      labelt.links = {
        ...labelt.links,
        twitter: `https://twitter.com/${twitter.handle}`,
      };
    }
  }

  return labelt;
}

const searchRegistry: Array<AddressLabels> = (function() {
  const requireContext = require.context("./labels", false, /.json$/);
  const keys = requireContext.keys();
  const values = keys.map(requireContext) as Array<AddressLabels>

  return values
})()


export interface SearchLabels extends Omit<AddressLabels, 'links'> {
  links: Array<{ name: SocialLabel, value: string }>
}

/**
 * @param address lowercase string. ex: "founder"
 */
export function searchLabel(searchTerm: string): Array<SearchLabels> {
  const results = searchRegistry.map(addressLabels => {
    const labels = addressLabels.labels.filter(label => label.value.toLowerCase().includes(searchTerm))

    const links = (Object.keys(addressLabels.links) as Array<SocialLabel>).reduce((acc, key) => {
      const socialValue = addressLabels.links[key]

      if (socialValue.toLowerCase().includes(searchTerm)) {
        acc.push({name: key, value: socialValue })
      }

      return acc
    }, [] as SearchLabels['links'])

    if (labels.length || Object.keys(links).length) {
      return {
        address: addressLabels.address,
        labels,
        links
      }
    }

    return null
  }).filter((result): result is SearchLabels => !!result)

  return results || []
}
