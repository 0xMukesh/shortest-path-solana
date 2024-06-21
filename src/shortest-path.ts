import { readFileSync } from "fs";

const buildGraph = (
  data: Array<{
    to: string;
    from: string;
    signature: string;
  }>
) => {
  const graph: Record<string, Array<string>> = {};

  data.forEach((tx) => {
    const { from, to } = tx;

    if (!graph[from]) {
      graph[from] = [];
    }
    if (!graph[to]) {
      graph[to] = [];
    }

    graph[from].push(to);
    graph[to].push(from);
  });

  return graph;
};

const bfsShortestPath = (
  graph: Record<string, Array<string>>,
  start: string,
  end: string
) => {
  if (start === end) return [start];

  const queue = [[start]];
  const visited = new Set();

  visited.add(start);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    for (const neighbor of graph[node] || []) {
      if (visited.has(neighbor)) {
        continue;
      }

      const newPath = [...path, neighbor];

      if (neighbor === end) {
        return newPath;
      }

      queue.push(newPath);
      visited.add(neighbor);
    }
  }

  return null;
};

const transactions = JSON.parse(
  readFileSync("data.json", {
    encoding: "utf-8",
  })
);
const graph = buildGraph(transactions);

const startAddress = "EApY74expkY3PfsgPxtLYHhjpsAkrLEtHiLdPXiQiBF8";
const endAddress = "87Fbmn8zfBHq77s8Jpn4Ap3WLSqvhCAfHQFTQ5Rh1HqR";

const path = bfsShortestPath(graph, startAddress, endAddress);

if (path) {
  console.log(path);
} else {
  console.log("no path found");
}
