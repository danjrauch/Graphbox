import { Graph, EdgeType } from "./../Graph/graph.ts";
import * as Serialize from "./../Serialization/serialize.ts";
import {
  runBenchmarks,
  bench,
} from "https://deno.land/std/testing/bench.ts";
import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import * as log from "https://deno.land/std/log/mod.ts";

bench(function roundTripSmallGraph(b): void {
  const graphName = "soc-sign-bitcoinalpha";

  const g: Graph<number, number> = Serialize.construct(
    `./Data/${graphName}.csv`,
    Serialize.StorageFormat.CSV,
    {
      edgeType: EdgeType.Directed,
      labelType: Serialize.TypeHint.number,
      valueType: Serialize.TypeHint.number,
    },
  ) as Graph<number, number>;

  log.info(`${graphName} has ${g.V.length} verticies.`);
  log.info(`${graphName} has ${g.E.length} edges.`);

  b.start();
  Serialize.save(g, `./Temp/${graphName}.json`, Serialize.StorageFormat.JSON);

  const g2: Graph<number, number> = Serialize.load(
    `./Temp/${graphName}.json`,
    Serialize.StorageFormat.JSON,
  );
  b.stop();
  assertEquals(g.equals(g2), true);
});

runBenchmarks();
