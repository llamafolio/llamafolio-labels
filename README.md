## Llamafolio Labels

This repository holds the information for the Llamafolio app to categorize address labels.

The available labels to use for address are two types: helpful information and social media.

## Labels for an Address

To add labels for an address, you need to create a new JSON file under the [labels](/labels) folder.

The content of the file should be like this:

```JSON
{
  "labels": [{ "type": "info", "value": "llamafolio" }],
  "links": {
    "twitter": "https://twitter.com/llamafolio"
  }
}
```

Each label is represented as an object with type and value properties.

To add a new label, use the following chart to know the property type.

| Type    | Color  | Useful For                                |
| ------- | ------ | ----------------------------------------- |
| info    | blue   | Known addresses or useful services        |
| warning | yellow | Exploited contracts or dangerous services |
| danger  | red    | Hackers, exploiters, or scammer addresses |

For social media links, only the following networks are available:

| Social Media |
| ------------ |
| twitter      |
| telegram     |
| github       |
| website      |
