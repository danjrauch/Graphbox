import { Graph, EdgeType } from "./../Graph/graph.ts";
import BFS from "./../Algorithm/BFS.ts";
import { randomString } from "./../Utilities/util.ts";
import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test("GRA | g.add | add a simple vertex to graph", () => {
  const g: Graph<string, string> = new Graph<string, string>(
    EdgeType.Undirected,
  );
  g.add({
    label: "A",
    value: "Dan",
  });
  assertEquals(g.V, [{ id: 0, label: "A", value: "Dan" }]);
});

Deno.test("GRA | g.removeVertex | remove a simple vertex from graph", () => {
  const g: Graph<string, string> = new Graph<string, string>(
    EdgeType.Undirected,
  );
  g.add({
    label: "A",
    value: "Dan",
  });
  assertEquals(g.V, [{ id: 0, label: "A", value: "Dan" }]);
  g.removeVertex("A");
  assertEquals(g.V, []);
});

Deno.test("GRA | g.removeVerticies | remove a few simple verticies from graph", () => {
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
  assertEquals(
    g.V,
    [{ id: 0, label: "A", value: 0 }, { id: 1, label: "B", value: 0 }],
  );
  g.removeVerticies(0);
  assertEquals(g.V, []);
});

Deno.test("GRA | g.removeEdge | remove a simple edge from graph", () => {
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
    src: "A",
    dest: "B",
  });
  assertEquals(
    g.V,
    [{ id: 0, label: "A", value: 0 }, { id: 1, label: "B", value: 0 }],
  );
  assertEquals(
    g.E,
    [{ id: -1, src: "A", dest: "B" }],
  );
  g.removeEdge({
    src: "A",
    dest: "B",
  });
  assertEquals(g.E, []);
});

Deno.test("ALG | BFS | simple BFS search", () => {
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
    value: 0,
  });
  g.add({
    src: "A",
    dest: "B",
  });
  g.add({
    src: "B",
    dest: "C",
  });
  assertEquals(BFS(g, "A", "C"), true);
});
