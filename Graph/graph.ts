import EventEmitter from "https://deno.land/x/events/mod.ts";

enum EdgeType {
  Undirected,
  Directed,
}

interface IVertex<TLabel, TValue> {
  id?: number;
  label: TLabel;
  value: TValue;
}

interface IEdge<TLabel> {
  id?: number;
  src: TLabel;
  dest: TLabel;
  weight?: number;
}

function isVertex<TLabel, TValue>(
  element: IVertex<TLabel, TValue> | IEdge<TLabel>,
): element is IVertex<TLabel, TValue> {
  return (<IVertex<TLabel, TValue>> element).label !== undefined &&
    (<IVertex<TLabel, TValue>> element).value !== undefined;
}

function isEdge<TLabel, TValue>(
  element: IVertex<TLabel, TValue> | IEdge<TLabel>,
): element is IEdge<TLabel> {
  return (<IEdge<TLabel>> element).src !== undefined &&
    (<IEdge<TLabel>> element).dest !== undefined;
}

interface IAdjacencyList {
  [id: number]: number[];
}

interface IAdjacencyMatrix {
  [id: number]: number[];
}

interface IGraph<TLabel, TValue> {
  V: IVertex<TLabel, TValue>[];
  E: IEdge<TLabel>[];
  EdgeType: EdgeType;
  add(element: IVertex<TLabel, TValue>): void;
  add(element: IEdge<TLabel>): void;
  removeVertex(label: TLabel): void;
  removeVerticies(value: TValue): void;
  removeEdge(edge: IEdge<TLabel>): void;
  adjacent(label: TLabel): IVertex<TLabel, TValue>[];
  equals(other: IGraph<TLabel, TValue>): boolean;
}

class Graph<TLabel, TValue> implements IGraph<TLabel, TValue> {
  private _vid: number = 0;
  private _eid: number = -1;
  private _stale: boolean = false;
  private _VLabelIndex: Set<TLabel>;
  private _VIndex: { [id: number]: IVertex<TLabel, TValue> } = [];
  private _adjacencyList: IAdjacencyList = [] as IAdjacencyList;
  private _adjacencyMatrix: IAdjacencyMatrix = [] as IAdjacencyMatrix;
  private _eventEmitter = new EventEmitter();

  private _V: IVertex<TLabel, TValue>[];
  public get V(): IVertex<TLabel, TValue>[] {
    return this._V;
  }

  private _E: IEdge<TLabel>[];
  public get E(): IEdge<TLabel>[] {
    return this._E;
  }

  private _edgeType: EdgeType;
  public get EdgeType(): EdgeType {
    return this._edgeType;
  }

  public constructor();
  public constructor(edgeType: EdgeType);
  public constructor(
    edgeType: EdgeType,
    V: IVertex<TLabel, TValue>[],
    E: IEdge<TLabel>[],
  );
  public constructor(
    edgeType: EdgeType = EdgeType.Undirected,
    V: IVertex<TLabel, TValue>[] = [],
    E: IEdge<TLabel>[] = [],
  ) {
    this._V = V;
    this._E = E;
    this._edgeType = edgeType;
    this._VLabelIndex = new Set(this._V.map((v) => v.label));
    this.constructAdjacencyList();
    this.constructAdjacencyMatrix();
    this._eventEmitter.on("vertexAdded", this.vertexAddedHandler);
    this._eventEmitter.on("vertexRemoved", this.vertexRemovedHandler);
    this._eventEmitter.on("edgeAdded", this.edgeAddedHandler);
    this._eventEmitter.on("edgeRemoved", this.edgeRemovedHandler);
  }

  private vertexAddedHandler = (vertex: IVertex<TLabel, TValue>) => {
    this._VLabelIndex.add(vertex.label);
    this._VIndex[vertex.id!] = vertex;
    this._stale = true;
  };

  private vertexRemovedHandler = (vertex: IVertex<TLabel, TValue>) => {
    this._VLabelIndex.delete(vertex.label);
    delete this._VIndex[vertex.id!];
    this._stale = true;
  };

  private edgeAddedHandler = (edge: IEdge<TLabel>) => {
  };

  private edgeRemovedHandler = (edge: IEdge<TLabel>) => {
  };

  public equals(other: Graph<TLabel, TValue>) {
    if (
      (this._V.length !== other._V.length) ||
      (this._E.length !== other._E.length) ||
      this.EdgeType !== other.EdgeType
    ) {
      return false;
    }
    this._V.sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0);
    other._V.sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0);

    for (let i = 0; i < this._V.length; ++i) {
      if (this._V[i].value !== other._V[i].value) {
        return false;
      }
    }

    this._E.sort((a, b) =>
      a.src < b.src
        ? -1
        : a.src > b.src
        ? 1
        : a.dest < b.dest
        ? -1
        : a.dest > b.dest
        ? 1
        : 0
    );
    other._E.sort((a, b) =>
      a.src < b.src
        ? -1
        : a.src > b.src
        ? 1
        : a.dest < b.dest
        ? -1
        : a.dest > b.dest
        ? 1
        : 0
    );

    for (let i = 0; i < this._E.length; ++i) {
      if (
        (this._E[i].src !== other._E[i].src) ||
        (this._E[i].dest !== other._E[i].dest)
      ) {
        return false;
      }
    }

    return true;
  }

  public add(element: IVertex<TLabel, TValue>): void;
  public add(element: IEdge<TLabel>): void;
  public add(element: IVertex<TLabel, TValue> | IEdge<TLabel>): void {
    if (isVertex(element)) {
      if (!this._VLabelIndex.has(element.label)) {
        element.id = this._vid++;
        this._V.push(element);
        this._eventEmitter.emit("vertexAdded", element);
      }
    } else {
      if (
        this._VLabelIndex.has(element.src) &&
        this._VLabelIndex.has(element.dest)
      ) {
        element.id = this._eid--;
        this._E.push(element);
        this._eventEmitter.emit("edgeAdded", element);
      }
    }
  }

  public removeVertex(label: TLabel): void {
    if (this._VLabelIndex.has(label)) {
      for (const [idx, vertex] of this._V.entries()) {
        if (vertex.label === label) {
          this._V.splice(idx, 1);
          this._eventEmitter.emit("vertexRemoved", vertex);
          break;
        }
      }
    }
  }

  public removeVerticies(value: TValue): void {
    const removed = this.V.filter((v) => v.value === value);
    this._V = this._V.filter((v) => v.value !== value);
    removed.forEach((v) => this._eventEmitter.emit("vertexRemoved", v));
  }

  public removeEdge(edge: IEdge<TLabel>): void {
    if (this._edgeType === EdgeType.Undirected) {
      this._E = this._E.filter((e) => {
        (e.dest !== edge.dest || e.src !== edge.src) &&
          (e.src !== edge.dest || e.dest !== edge.src);
      });
    } else if (this._edgeType === EdgeType.Directed) {
      this._E = this._E.filter((e) =>
        e.dest !== edge.dest || e.src !== edge.src
      );
    }
    this._eventEmitter.emit("edgeRemoved", edge);
  }

  public adjacent(label: TLabel): IVertex<TLabel, TValue>[] {
    if (this._stale) {
      this.constructAdjacencyList();
      this.constructAdjacencyMatrix();
      this._stale = false;
    }

    if (!this._VLabelIndex.has(label)) {
      return [];
    }
    const srcId = this._V.filter((v) => v.label === label)[0].id!;
    return this._adjacencyList[srcId].map((e) => this._VIndex[e]);
  }

  private constructAdjacencyList(): void {
    this._adjacencyList = this._V.reduce((prev, curr) => {
      prev[curr.id!] = [];
      return prev;
    }, [] as IAdjacencyList);

    this._E.forEach((e) => {
      const srcId = this._V.filter((v) => v.label === e.src)[0].id!;
      const destId = this._V.filter((v) => v.label === e.dest)[0].id!;

      if (this._adjacencyList[srcId].indexOf(destId) === -1) {
        this._adjacencyList[srcId].push(destId);
      }
      if (
        this._edgeType === EdgeType.Undirected &&
        this._adjacencyList[destId].indexOf(srcId) === -1
      ) {
        this._adjacencyList[destId].push(srcId);
      }
    });
  }

  private constructAdjacencyMatrix(): void {
    this._adjacencyMatrix = [] as IAdjacencyMatrix;
    this._adjacencyMatrix = this._V.reduce((prev, curr) => {
      prev[curr.id!] = [];
      for (let i = 0; i < this._V.length; ++i) {
        prev[curr.id!].push(0);
      }
      return prev;
    }, [] as IAdjacencyMatrix);

    this._E.forEach((e) => {
      const srcId = this._V.filter((v) => v.label === e.src)[0].id!;
      const destId = this._V.filter((v) => v.label === e.dest)[0].id!;

      this._adjacencyMatrix[srcId][destId] = 1;
      if (
        this._edgeType === EdgeType.Undirected
      ) {
        this._adjacencyMatrix[destId][srcId] = 1;
      }
    });
  }
}

export { EdgeType, IGraph, IVertex, IEdge, Graph };
