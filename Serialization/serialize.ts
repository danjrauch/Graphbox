import { IGraph, Graph, IVertex, IEdge, EdgeType } from "./../Graph/graph.ts";
import * as fs from "https://deno.land/std/fs/mod.ts";

enum StorageFormat {
  JSON,
}

type FundamentalGraph<TLabel, TValue> = {
  "V": IVertex<TLabel, TValue>[];
  "E": IEdge<TLabel>[];
  "EdgeType": EdgeType;
};

function load<TLabel, TValue>(
  fileName: string,
  storageFormat: StorageFormat,
): Graph<TLabel, TValue> {
  if (!fs.existsSync(fileName)) {
    throw new Deno.errors.NotFound();
  }
  let jsonContent: FundamentalGraph<TLabel, TValue>;
  switch (storageFormat) {
    case StorageFormat.JSON: {
      jsonContent = fs.readJsonSync(fileName) as FundamentalGraph<
        TLabel,
        TValue
      >;
    }
  }
  return new Graph(jsonContent.EdgeType, jsonContent.V, jsonContent.E);
}

function save<TLabel, TValue>(
  graph: IGraph<TLabel, TValue>,
  fileName: string,
  storageFormat: StorageFormat,
): void {
  fs.ensureFileSync(fileName);
  switch (storageFormat) {
    case StorageFormat.JSON: {
      fs.writeJsonSync(fileName, { "V": graph.V, "E": graph.E }, { spaces: 2 });
    }
  }
}

export { StorageFormat, load, save };
