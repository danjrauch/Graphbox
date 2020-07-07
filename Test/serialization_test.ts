import { Graph, EdgeType } from "./../Graph/graph.ts";
import { load, save, StorageFormat } from "./../Serialization/serialize.ts";
import { randomString } from "./../Utilities/util.ts";
import * as fs from "https://deno.land/std/fs/mod.ts";
import {
  assertEquals,
  assertArrayContains,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test("SER | save+load | round-trip JSON serialization", () => {
  fs.ensureDirSync("./Temp/");
  const g: Graph<string, number> = new Graph<string, number>(
    EdgeType.Undirected,
  );
  g.add({
    label: "A",
    value: 0,
  });
  g.add({
    label: "B",
    value: 0,
  });
  g.add({
    label: "C",
    value: 1,
  });
  g.add({
    src: "B",
    dest: "C",
  });
  g.add({
    src: "A",
    dest: "B",
  });
  save(g, "./Temp/test_graph.json", StorageFormat.JSON);
  const g2: Graph<string, number> = load(
    "./Temp/test_graph.json",
    StorageFormat.JSON,
  );
  assertEquals(g.equals(g2), true);
  fs.emptyDirSync("./Temp/");
});
