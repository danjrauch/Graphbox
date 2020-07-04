import { IGraph, IVertex } from "./../Graph/graph.ts";

function BFS<TLabel, TValue>(
  graph: IGraph<TLabel, TValue>,
  src: TLabel,
  dest: TLabel,
): boolean {
  let queue = [src];
  let visited = new Set([src]);
  while (queue.length > 0) {
    const label = queue.shift()!;
    if (label === dest) {
      return true;
    }
    graph.adjacent(label).forEach((e) => {
      if (!visited.has(e.label)) {
        queue.push(e.label);
        visited.add(e.label);
      }
    });
  }
  return false;
}

export { BFS };
