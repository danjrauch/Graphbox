import { Graph, EdgeType } from "./../Graph/graph.ts";
import { randomString, shuffle } from "./../Utilities/util.ts";
import { runBenchmarks, bench } from "https://deno.land/std/testing/bench.ts";

bench(function addX1e4(b): void {
  const g: Graph<string, number> = new Graph<string, number>(
    EdgeType.Undirected,
  );
  const VSIZE = 1e4;
  let labels: string[] = [];
  for (let i = 0; i < VSIZE; ++i) {
    labels.push(randomString(30));
  }
  b.start();
  for (const label of labels) {
    g.add({
      label: label,
      value: 0,
    });
  }
  b.stop();
});

bench(function removeVertexX1e4(b): void {
  const g: Graph<string, number> = new Graph<string, number>(
    EdgeType.Undirected,
  );
  const VSIZE = 1e4;
  let labels: string[] = [];
  for (let i = 0; i < VSIZE; ++i) {
    labels.push(randomString(30));
  }
  for (const label of labels) {
    g.add({
      label: label,
      value: 0,
    });
  }
  shuffle(labels);
  b.start();
  for (const label of labels) {
    g.removeVertex(label);
  }
  b.stop();
});

bench(function removeVerticiesX1e4(b): void {
  const g: Graph<string, number> = new Graph<string, number>(
    EdgeType.Undirected,
  );
  const VSIZE = 1e4;
  let labels: string[] = [];
  let values: number[] = [];
  for (let i = 0; i < VSIZE; ++i) {
    labels.push(randomString(30));
    values.push(Math.random() * VSIZE * 100);
  }
  for (let i = 0; i < VSIZE; ++i) {
    g.add({
      label: labels[i],
      value: values[i],
    });
  }
  b.start();
  for (const value of values) {
    g.removeVerticies(value);
  }
  b.stop();
});

runBenchmarks();
