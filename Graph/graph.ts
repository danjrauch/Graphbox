enum EdgeType
{
    Undirected,
    Directed,
}

interface IVertex<T, S>
{
    id?: number;
    label: T;
    value: S;
}

interface IEdge<T>
{
    id?: number;
    src: T;
    dest: T;
    weight?: number;
}

function isVertex<T, S>(element: IVertex<T, S> | IEdge<T>): element is IVertex<T, S>
{
    return (<IVertex<T, S>>element).label !== undefined &&
        (<IVertex<T, S>>element).value !== undefined;
}

function isEdge<T, S>(element: IVertex<T, S> | IEdge<T>): element is IEdge<T>
{
    return (<IEdge<T>>element).src !== undefined &&
        (<IEdge<T>>element).dest !== undefined;
}

interface IAdjacencyList
{
    [id: number]: number[];
}

interface IGraph<T, S>
{
    V: IVertex<T, S>[];
    E: IEdge<T>[];
    EdgeType: EdgeType;
    add(element: IVertex<T, S>): void;
    add(element: IEdge<T>): void;
    removeVertex(label: T): void;
    removeVerticies(value: S): void;
    removeEdge(edge: IEdge<T>): void;
}

class Graph<T, S> implements IGraph<T, S>
{
    private _vid: number = 1;
    private _eid: number = -1;

    private _V: IVertex<T, S>[];
    public get V(): IVertex<T, S>[]
    {
        return this._V;
    }

    private _E: IEdge<T>[];
    public get E(): IEdge<T>[]
    {
        return this._E;
    }

    private _edgeType: EdgeType;
    public get EdgeType(): EdgeType
    {
        return this._edgeType;
    }

    private _adjacencyList: IAdjacencyList = [] as IAdjacencyList;

    public constructor();
    public constructor(edgeType: EdgeType);
    public constructor(edgeType?: EdgeType)
    {
        if (typeof edgeType === "undefined")
        {
            this._V = [];
            this._E = [];
            this._edgeType = EdgeType.Undirected;
        }
        else
        {
            this._V = [];
            this._E = [];
            this._edgeType = edgeType;
        }
    }

    private constructAdjacencyList(): void
    {
        this._adjacencyList = this._V.reduce((prev, curr) =>
        {
            prev[curr.id!] = [];
            return prev;
        }, [] as IAdjacencyList);

        this._E.forEach((e) =>
        {
            const srcId = this._V.filter((v) => v.label === e.src)[0].id!;
            const destId = this._V.filter((v) => v.label === e.dest)[0].id!;

            if (this._adjacencyList[srcId].indexOf(destId) === -1)
            {
                this._adjacencyList[srcId].push(destId);
            }
            if (
                this._edgeType === EdgeType.Undirected &&
                this._adjacencyList[destId].indexOf(srcId) === -1
            )
            {
                this._adjacencyList[destId].push(srcId);
            }
        });
    }

    public add(element: IVertex<T, S>): void;
    public add(element: IEdge<T>): void;
    public add(element: IVertex<T, S> | IEdge<T>): void
    {
        if (isVertex(element))
        {
            if (!this._V.some((e) => e.label === element.label))
            {
                element.id = this._vid++;
                this._V.push(element);
            }
        }
        else
        {
            if (
                this._V.some((e) => e.label === element.src) &&
                this._V.some((e) => e.label === element.dest)
            )
            {
                element.id = this._eid++;
                this._E.push(element);
            }
        }
    }

    public removeVertex(label: T): void
    {
        this._V = this._V.filter((v) => v.label !== label);
    }

    public removeVerticies(value: S): void
    {
        this._V = this._V.filter((v) => v.value !== value);
    }

    public removeEdge(edge: IEdge<T>): void
    {
        this._E = this._E.filter((e) => e.dest !== edge.dest || e.src !== edge.src);
    }
}

export { EdgeType, Graph };
