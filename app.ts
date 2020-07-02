import { Graph, EdgeType } from './Graph/graph.ts';

const g: Graph<string, string> = new Graph<string, string>(EdgeType.Directed);
g.add({
    label: "A",
    value: "Dan",
});
g.add({
    label: "B",
    value: "Dayla",
})
g.add({
    src: "A",
    dest: "B",
});

console.log(g.V);
console.log(g.E);

g.removeVertex("A");
g.removeVerticies("Dayla");
g.removeEdge({
    src: "A",
    dest: "B", 
});

console.log('removed');
console.log(g.V);
console.log(g.E);
