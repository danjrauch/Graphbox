import { Graph, EdgeType } from "./graph.ts";
import
    {
        assertEquals,
        assertArrayContains,
    } from "https://deno.land/std/testing/asserts.ts";

Deno.test("graph simple add vertex", () => {
    const g: Graph<string, string> = new Graph<string, string>(EdgeType.Undirected);
    g.add({
        label: "A",
        value: "Dan",
    });
    assertEquals(g.V, [{ id: 0, label: "A", value: "Dan" }]);
});