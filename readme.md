# shortest-path-solana

_something like 6 degree separation but on solana_

a script to mock transfers among 100 random accounts (on localnet) and find the shortest path between two accounts using [BFS algorithm](https://en.wikipedia.org/wiki/Breadth-first_search)

example - https://imgur.com/a/yM1vSlc

## file structure

1. `src/index.ts` - contains mock transfer simulator, which creates a new file named `data.json` after the simulation is done

2. `src/shortest-path.ts` - implementation of BFS

3. `data.json` - contains transaction history of the simulation
