import { IGraph, Graph, IVertex, IEdge, EdgeType } from "./../Graph/graph.ts";
import * as fs from "https://deno.land/std/fs/mod.ts";

enum StorageFormat {
  JSON,
  CSV,
}

type StorageArgs = {
  edgeType?: EdgeType;
};

type SimpleGraph<TLabel, TValue> = {
  "V": IVertex<TLabel, TValue>[];
  "E": IEdge<TLabel>[];
  "EdgeType": EdgeType;
};

function load<TLabel, TValue>(
  fileName: string,
  storageFormat: StorageFormat,
  edgeType: EdgeType = EdgeType.Undirected,
): Graph<TLabel, TValue> {
  if (!fs.existsSync(fileName)) {
    throw new Deno.errors.NotFound(`${fileName} not found`);
  }
  let jsonContent: SimpleGraph<TLabel, TValue>;
  switch (storageFormat) {
    case StorageFormat.JSON: {
      jsonContent = fs.readJsonSync(fileName) as SimpleGraph<
        TLabel,
        TValue
      >;
      break;
    }
    case StorageFormat.CSV: {
      jsonContent = { V: [], E: [], EdgeType: edgeType };
      for (
        const line of fs.readFileStrSync(fileName, { encoding: "utf-8" }).split(
          "\n",
        )
      ) {
        const props = line.split(",");
        // TODO Fix string to TLabel type conversion
        const srcLabel: TLabel = props[0] as any;
        console.log(typeof srcLabel);
        const destLabel: TLabel = props[1] as unknown as TLabel;
        jsonContent.V.push({ label: srcLabel }, { label: destLabel });
        jsonContent.E.push(
          { src: srcLabel, dest: destLabel, weight: Number(props[2]) },
        );
      }
      break;
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
      fs.writeJsonSync(
        fileName,
        { V: graph.V, E: graph.E, EdgeType: graph.EdgeType },
        { spaces: 2 },
      );
      break;
    }
    case StorageFormat.CSV: {
      throw new Deno.errors.NotFound(
        "Saving a graph with StorageFormat.CSV is not implemented yet",
      );
      break;
    }
  }
}

export { StorageFormat, load, save };
