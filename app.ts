import * as G from "./Graph/graph.ts";
import * as S from "./Serialization/serialize.ts";
import BFS from "./Algorithm/BFS.ts";

const g: G.Graph<number, number> = S.load(
  "./Temp/soc-sign-bitcoinalpha.json",
  S.StorageFormat.JSON,
);

console.log(g.E[4]);

const src = 177;
const dest = 1033;

console.log(`${src} ${BFS(g, src, dest) ? "can" : "cannot"} find ${dest}`);
