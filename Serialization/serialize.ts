import { IGraph, Graph, IVertex, IEdge, EdgeType } from "./../Graph/graph.ts";
import * as fs from "https://deno.land/std/fs/mod.ts";

enum StorageFormat {
  JSON,
  CSV,
}

enum TypeHint {
  number,
  string,
}

interface StorageArgs {
  edgeType: EdgeType;
  labelType: TypeHint;
  valueType: TypeHint;
}

type SimpleGraph<TLabel, TValue> = {
  "V": IVertex<TLabel, TValue>[];
  "E": IEdge<TLabel>[];
  "EdgeType": EdgeType;
};

function load<TLabel, TValue>(
  fileName: string,
  storageFormat: StorageFormat,
  args: StorageArgs = {
    edgeType: EdgeType.Undirected,
    labelType: TypeHint.string,
    valueType: TypeHint.string,
  },
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
      throw new Deno.errors.NotFound(
        "CSV files cannot be directly loaded into a graph. Use the import function instead.",
      );
      break;
    }
  }
  return new Graph(jsonContent.EdgeType, jsonContent.V, jsonContent.E);
}

function construct(
  fileName: string,
  storageFormat: StorageFormat,
  args: StorageArgs = {
    edgeType: EdgeType.Undirected,
    labelType: TypeHint.string,
    valueType: TypeHint.string,
  },
): Graph<number | string, number | string> {
  let jsonContent: SimpleGraph<number | string, number | string> = {
    V: [],
    E: [],
    EdgeType: args.edgeType,
  };
  switch (storageFormat) {
    case StorageFormat.CSV: {
      for (
        const line of fs.readFileStrSync(fileName, { encoding: "utf-8" }).split(
          "\n",
        )
      ) {
        const props = line.split(",");
        if (
          props.length < 3 || props.filter((e) => e.trim() === "").length > 0
        ) {
          continue;
        }
        const srcLabel: number | string = args.labelType === TypeHint.string
          ? props[0]
          : Number(props[0]);
        const destLabel: number | string = args.valueType === TypeHint.string
          ? props[1]
          : Number(props[1]);
        jsonContent.V.push({ label: srcLabel }, { label: destLabel });
        jsonContent.E.push(
          { src: srcLabel, dest: destLabel, weight: Number(props[2]) },
        );
      }
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

export { StorageFormat, TypeHint, load, save, construct };
