
import { GRID_SIZE } from "../../pathfindingVisualizer/pathfindingVisualizer";

export function setInitialGrid(startNode, endNode){
    let grid = [];
   for(let row = 0; row < GRID_SIZE.rows; row++){
       let currRow = [];
       for(let col = 0; col < GRID_SIZE.cols; col++){
            currRow.push(createNode(row, col, startNode, endNode));
        }
        grid.push(currRow);
   }
   return grid;
}

function createNode(row, col, startNode, endNode){
    return {
        row: row,
        col: col,
        isStart: row === startNode.row && col === startNode.col,
        isEnd: row === endNode.row && col === endNode.col,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null
    };
}

export function toggleWall(grid, row, col){
    let newGrid = grid.slice();
    let node = newGrid[row][col];
    let newNode ={...node, isWall: !node.isWall};
    newGrid[row][col]= newNode;
    return newGrid;
}

export function getGridWithDynamicNodes(grid, row, col, pos, startPos, endPos){
    let newGrid = grid.slice();
    let node = newGrid[row][col];
    if(pos === 'start'){
        newGrid[startPos.row][startPos.col].isStart = false;
        let newNode = { ...node, isStart: true};
        newGrid[row][col] = newNode;

    }
    if(pos === 'end'){
        newGrid[endPos.row][endPos.col].isEnd = false;
        let newNode = { ...node, isEnd: true};
        newGrid[row][col]= newNode;
    }

    return newGrid;
}