interface PriorityQueue<T> {
  insert(item: T, priority: number): void;
  peek(): T | undefined;
  pop(): T | undefined;
  size(): number;
  isEmpty(): boolean;
}

const priorityQueue = <T>(): PriorityQueue<T> => {
  let heap: [number, T][] = [];

  const parent = (index: number) => Math.floor((index - 1) / 2);
  const left = (index: number) => 2 * index + 1;
  const right = (index: number) => 2 * index + 2;
  const hasLeft = (index: number) => left(index) < heap.length;
  const hasRight = (index: number) => right(index) < heap.length;

  const swap = (a: number, b: number) => {
    const tmp = heap[a];
    heap[a] = heap[b];
    heap[b] = tmp;
  };

  return {
    isEmpty: () => heap.length == 0,

    peek: () => heap.length == 0 ? undefined : heap[0][1],

    size: () => heap.length,

    insert: (item, prio) => {
      heap.push([prio, item]);

      let i = heap.length - 1;
      while (i > 0) {
        const p = parent(i);
        if (heap[p][0] < heap[i][0]) break;
        swap(i, p);
        // const tmp = heap[i];
        // heap[i] = heap[p];
        // heap[p] = tmp;
        i = p;
      }
    },

    pop: () => {
      if (heap.length === 0) return undefined;

      swap(0, heap.length - 1);
      const item = heap.pop();

      let current = 0;
      while (hasLeft(current)) {
        let smallerChild = left(current);
        if (
          hasRight(current) && heap[right(current)][0] < heap[left(current)][0]
        ) {
          smallerChild = right(current);
        }

        if (heap[smallerChild][0] > heap[current][0]) break;

        swap(current, smallerChild);
        current = smallerChild;
      }

      return item ? item[1] : undefined;
    },
  };
};
