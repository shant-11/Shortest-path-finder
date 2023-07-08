import { GRID_SIZE } from "../pathfindingVisualizer/pathfindingVisualizer.jsx"

export function sparseMaze(startNode, endNode){
    let walls=[];

    for(let row=0; row < GRID_SIZE.rows; row++){
        for(let col=0; col < GRID_SIZE.cols; col++){
            if( (row === startNode.row && col === startNode.col)
             || (row === endNode.row && col === endNode.col) )
             continue;

             if(Math.random() <= 0.2){
                walls.push([row, col]);
             }
        }
    }
    return walls;
}

export function denseMaze(startNode, endNode){
    let walls=[];

    for(let row=0; row < GRID_SIZE.rows; row++){
        for(let col=0; col < GRID_SIZE.cols; col++){
            if( (row === startNode.row && col === startNode.col)
             || (row === endNode.row && col === endNode.col) )
             continue;

             if(Math.random() <= 0.4){
                walls.push([row, col]);
             }
        }
    }
    return walls;
}