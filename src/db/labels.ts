import { PoolClient } from "pg";
import format from "pg-format";

export interface Label {
  address: string;
  type: string;
  value: string;
  updated_at: Date;
}

export interface LabelStorage {
  address: Buffer;
  type: string;
  value: string;
  updated_at: string;
}

export interface LabelStorable {
  address: Buffer;
  type: string;
  value: string;
  updated_at: Date;
}

function strToBuf(str: string) {
  return Buffer.from(str.substring(2), "hex");
}

function sliceIntoChunks<T>(arr: T[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function toRow(label: LabelStorable) {
  return [label.address, label.type, label.value, label.updated_at];
}

function toStorage(labels: Label[]) {
  const labelsStorable: LabelStorable[] = [];

  for (const label of labels) {
    const { address, type, value, updated_at } = label;

    const labelStorable: LabelStorable = {
      address: strToBuf(address),
      type,
      value,
      updated_at,
    };

    labelsStorable.push(labelStorable);
  }

  return labelsStorable;
}

export function insertLabels(client: PoolClient, labels: Label[]) {
  const values = toStorage(labels).map(toRow);

  if (values.length === 0) {
    return;
  }

  return Promise.all(
    sliceIntoChunks(values, 200).map((chunk) =>
      client.query(
        format(
          "INSERT INTO public.labels (address, type, value, updated_at) VALUES %L ON CONFLICT DO NOTHING;",
          chunk
        ),
        []
      )
    )
  );
}
