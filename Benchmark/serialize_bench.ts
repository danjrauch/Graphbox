import { Graph, EdgeType } from "./../Graph/graph.ts";
import * as Serialize from "./../Serialization/serialize.ts";
import {
  runBenchmarks,
  bench,
  BenchmarkRunProgress,
  ProgressState,
} from "https://deno.land/std/testing/bench.ts";
import * as log from "https://deno.land/std/log/mod.ts";

bench(function roundTripSmallGraph(b): void {
  const graphName = "soc-sign-bitcoinalpha";

  const g: Graph<number, number> = Serialize.load(
    `./Data/${graphName}.csv`,
    Serialize.StorageFormat.CSV,
    EdgeType.Directed,
  );

  log.info(`${graphName} has ${g.V.length} verticies.`);
  log.info(`${graphName} has ${g.E.length} edges.`);

  b.start();
  Serialize.save(g, `./Temp/${graphName}.json`, Serialize.StorageFormat.JSON);

  const g2: Graph<number, number> = Serialize.load(
    `./Temp/${graphName}.json`,
    Serialize.StorageFormat.JSON,
  );
  b.stop();
});

runBenchmarks();
