type identifier = number | string;

enum EdgeType {
    Undirected,
    Directed,
}

interface IVertex {
    id: number;
    label: identifier;
    value: unknown;
}

interface IEdge {
    id: number;
    src: number;
    dest: number;
}

interface IAdjacencyList {
    [id: number]: number[];
}

interface IGraph {
    V: IVertex[];
    E: IEdge[];
    EdgeType: EdgeType;
    constructAdjacencyList(): void;
    addV(vertex: IVertex): void;
    addE(edge: IEdge): void;
    removeV(vertex: IVertex): void;
    removeV(vertex: number): void;
    removeE(edge: IEdge): void;
    removeE(edge: number): void;
}

class Graph implements IGraph {
    private _V: IVertex[] = [];
    public get V(): IVertex[] {
        return this._V;
    }

    private _E: IEdge[] = [];
    public get E(): IEdge[] {
        return this._E;
    }

    private _edgeType: EdgeType = EdgeType.Undirected;
    public get EdgeType(): EdgeType {
        return this._edgeType;
    }

    private _adjacencyList: IAdjacencyList = [] as IAdjacencyList;
    public get AdjacencyList(): IAdjacencyList {
        return this._adjacencyList;
    }

    public constructor(edgeType: EdgeType) {
        this._edgeType = edgeType;
    }

    public constructAdjacencyList(): void {
        this._adjacencyList = this._V.reduce((prev, curr) => {
            prev[curr.id] = [];
            return prev;
        }, [] as IAdjacencyList);

        this._E.forEach((e) => {
            if (!this._adjacencyList[e.src].includes(e.dest)) {
                this._adjacencyList[e.src].push(e.dest);
            }
            if (
                this._edgeType === EdgeType.Undirected &&
                !this._adjacencyList[e.dest].includes(e.src)
            ) {
                this._adjacencyList[e.dest].push(e.src);
            }
        });
    }

    public addV(vertex: IVertex): void {
        if (!this._V.includes(vertex)) {
            this._V.push(vertex);
        }
    }

    public addE(edge: IEdge): void {
        if (
            !this._E.includes(edge) &&
            this._V.some((e) => e.id === edge.src) &&
            this._V.some((e) => e.id === edge.dest)
        ) {
            this._E.push(edge);
        }
    }

    public removeV(vertex: IVertex): void;
    public removeV(vertex: number): void;
    public removeV(vertex: IVertex | number): void {
        if (typeof vertex !== "number") {
            vertex = vertex.id;
        }
        this._V = this._V.filter((e) => e.id !== vertex);
    }

    public removeE(edge: IEdge): void;
    public removeE(edge: number): void;
    public removeE(edge: IEdge | number): void {
        if (typeof edge !== "number") {
            edge = edge.id;
        }
        this._E = this._E.filter((e) => e.id !== edge);
    }
}

const g: Graph = new Graph(EdgeType.Directed);
g.addV({
    id: 0,
    label: "A",
    value: 5,
});
g.addE({
    id: 0,
    src: 0,
    dest: 1,
});

console.log(g.V);
console.log(g.E);
console.log(g.AdjacencyList);
g.constructAdjacencyList();
g.removeV(0);
g.removeV({
    id: 1,
    label: "B",
    value: 6,
});
g.removeE({
    id: 0,
    src: 0,
    dest: 1,
});
console.log(g.V);
console.log(g.E);
console.log(g.AdjacencyList);
