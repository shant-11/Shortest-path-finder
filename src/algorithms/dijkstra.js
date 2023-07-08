export function dijkstra(grid, startNode, endNode){
   let visitedNodesInOrder = [];
   let unvisitedNodes = getAllNodes(grid);
   startNode.distance = 0;

   while(unvisitedNodes.length !== 0){
    sortNodes(unvisitedNodes);
    let currNode = unvisitedNodes.shift();
    if(currNode.isWall) continue;
    if(currNode.distance === Infinity) return visitedNodesInOrder;

    currNode.isVisited = true;
    visitedNodesInOrder.push(currNode);
    if(currNode === endNode) return visitedNodesInOrder;
    relaxUnvisitedNeighbors(grid, currNode);
   }
}

function relaxUnvisitedNeighbors(grid, node){
   let unvisitedNeighbors = getUnvisitedNeighbors(grid, node);

   for(let neighbor of unvisitedNeighbors){
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
   }
}

function getUnvisitedNeighbors(grid, node){
   let unvisitedNeighbors = [];
   let {row, col} = node;
   if(row + 1 < grid.length) unvisitedNeighbors.push(grid[row+1][col]);
   if(row - 1 >= 0 ) unvisitedNeighbors.push(grid[row-1][col]);
   if(col + 1 < grid[0].length) unvisitedNeighbors.push(grid[row][col+1]);
   if(col - 1 >= 0) unvisitedNeighbors.push(grid[row][col-1]);

   return unvisitedNeighbors.filter((nodeItem) => !nodeItem.isVisited);
}

function sortNodes(nodes){
    nodes.sort((a, b) => a.distance - b.distance);
}

function getAllNodes(grid){
    let allNodes = [];

    for(let row of grid){
        for(let node of row){
            allNodes.push(node);
        }
    }
    return allNodes;
}

export function getNodesInPath(endNode){
    let path = [];
    let currNode = endNode;
    while(currNode !== null){
        path.unshift(currNode);
        currNode = currNode.previousNode;
    }

    return path;
}
