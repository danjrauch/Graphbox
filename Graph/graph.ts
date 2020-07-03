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
}

class Graph<TLabel, TValue> implements IGraph<TLabel, TValue> {
  private _vid: number = 0;
  private _eid: number = -1;

  private _V: IVertex<TLabel, TValue>[];
  public get V(): IVertex<TLabel, TValue>[] {
    return this._V;
  }

  private _VLabelIndex: Set<TLabel>;

  private _E: IEdge<TLabel>[];
  public get E(): IEdge<TLabel>[] {
    return this._E;
  }

  private _edgeType: EdgeType;
  public get EdgeType(): EdgeType {
    return this._edgeType;
  }

  public get AdjacencyList(): IAdjacencyList {
    let adjacencyList = this._V.reduce((prev, curr) => {
      prev[curr.id!] = [];
      return prev;
    }, [] as IAdjacencyList);

    this._E.forEach((e) => {
      const srcId = this._V.filter((v) => v.label === e.src)[0].id!;
      const destId = this._V.filter((v) => v.label === e.dest)[0].id!;

      if (adjacencyList[srcId].indexOf(destId) === -1) {
        adjacencyList[srcId].push(destId);
      }
      if (
        this._edgeType === EdgeType.Undirected &&
        adjacencyList[destId].indexOf(srcId) === -1
      ) {
        adjacencyList[destId].push(srcId);
      }
    });
    return adjacencyList;
  }

  public get AdjacencyMatrix(): IAdjacencyMatrix {
    let adjacencyMatrix = [] as IAdjacencyMatrix;
    adjacencyMatrix = this._V.reduce((prev, curr) => {
      prev[curr.id!] = [];
      for (let i = 0; i < this._V.length; ++i) {
        prev[curr.id!].push(0);
      }
      return prev;
    }, [] as IAdjacencyMatrix);

    this._E.forEach((e) => {
      const srcId = this._V.filter((v) => v.label === e.src)[0].id!;
      const destId = this._V.filter((v) => v.label === e.dest)[0].id!;

      adjacencyMatrix[srcId][destId] = 1;
      if (
        this._edgeType === EdgeType.Undirected
      ) {
        adjacencyMatrix[destId][srcId] = 1;
      }
    });
    return adjacencyMatrix;
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
  }

  public add(element: IVertex<TLabel, TValue>): void;
  public add(element: IEdge<TLabel>): void;
  public add(element: IVertex<TLabel, TValue> | IEdge<TLabel>): void {
    if (isVertex(element)) {
      if (!this._VLabelIndex.has(element.label)) {
        element.id = this._vid++;
        this._V.push(element);
        this._VLabelIndex.add(element.label);
      }
    } else {
      if (
        this._VLabelIndex.has(element.src) &&
        this._VLabelIndex.has(element.dest)
      ) {
        element.id = this._eid--;
        this._E.push(element);
      }
    }
  }

  public removeVertex(label: TLabel): void {
    if (this._VLabelIndex.has(label)) {
      this._V = this._V.filter((v) => v.label !== label);
      this._VLabelIndex.delete(label);
    }
  }

  public removeVerticies(value: TValue): void {
    const verticiesToRemove = this._V.filter((v) => v.value === value);
    const labelsToRemove: Set<TLabel> = new Set<TLabel>(
      verticiesToRemove.map((v) => v.label),
    );
    this._V = this._V.filter((v) => !labelsToRemove.has(v.label));
    labelsToRemove.forEach((label) => this._VLabelIndex.delete(label));
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
  }
}

export { EdgeType, Graph };
