import React, {Component} from 'react';
import Node from '../components/node/node.jsx';
import { setInitialGrid, toggleWall, getGridWithDynamicNodes } from '../components/grid/grid.jsx';
import { dijkstra, getNodesInPath } from '../algorithms/dijkstra.js';
import { sparseMaze, denseMaze } from '../mazes/maze.js';

export const GRID_SIZE = {
    rows: 25,
    cols: 50
};
const START_NODE_POS = {
    row: Math.floor(GRID_SIZE.rows/2),
    col: Math.floor(GRID_SIZE.cols/5)
};
const END_NODE_POS = {
    row: Math.floor(GRID_SIZE.rows/2),
    col: Math.floor(GRID_SIZE.cols*4/5)
};
export default class PathfindingVisualizer extends Component {
    constructor(props){
        super(props);

        this.state = {
            grid: [],
            startNodePos: START_NODE_POS,
            endNodePos: END_NODE_POS,
            visitedNodes: [],
            pathNodes: [],
            walls: [],
            isRunning: false,
            pressedKey: ''
            
        }
        this.runDijkstra = this.runDijkstra.bind(this);
        this.animateVisitedNodes = this.animateVisitedNodes.bind(this);
        this.animatePath = this.animatePath.bind(this);
        this.clearGrid = this.clearGrid.bind(this);
        this.clearPath = this.clearPath.bind(this);
        this.generateMaze = this.generateMaze.bind(this);
        this.setWalls = this.setWalls.bind(this);
        this.animateWalls = this.animateWalls.bind(this);
        this.clearMazeAndWalls = this.clearMazeAndWalls.bind(this);
        // this.handleMouseDown = this.handleMouseDown.bind(this);
        // this.handleMouseEnter = this.handleMouseEnter.bind(this);
        // this.handleMouseUp = this.handleMouseUp.bind(this);
        // this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
       // this.handleKeyRelease = this.handleKeyRelease.bind(this);
    }
    componentDidMount(){
        this.setState({
            grid: setInitialGrid(this.state.startNodePos, this.state.endNodePos)
        });
        document.addEventListener("keydown", this.handleKeyPress);
    }
    
       handleKeyPress = (event) => {
          this.setState({
            pressedKey: event.key
          });
      }
    
      handleMouseOver(row, col){
           if(this.state.pressedKey === "w"){
            let newGrid = toggleWall(this.state.grid, row, col);
            this.setState({ grid: newGrid});
           }
           let newPos = {row: row, col: col};
           if(this.state.pressedKey === 's'){
            let newGrid = getGridWithDynamicNodes(this.state.grid,row, col, 'start',this.state.startNodePos, this.state.endNodePos);
            this.setState({
                grid: newGrid,
                startNodePos: newPos
            });
           }
           if(this.state.pressedKey === 'e'){
            let newGrid = getGridWithDynamicNodes(this.state.grid, row, col, 'end', this.state.startNodePos, this.state.endNodePos);
            this.setState({
                grid: newGrid,
                endNodePos: newPos
            });
           }
      }

    setWalls(){
        let newGrid = this.state.grid.slice();
        let i =0;
        for(let wall of this.state.walls){
            newGrid[wall[0]][wall[1]].isWall = true;
            i++;    
        }
        if(i === this.state.walls.length){
        setTimeout(() => {
          this.setState({
              grid: newGrid
          });
          i++;
         }, i);
        } 
        if(i === this.state.walls.length + 1){
        setTimeout(() => {
            this.animateWalls();
        }, 2*i);
        } ; 
       
    }

    animateWalls(){
        let {walls} = this.state;
       for(let i=0; i < walls.length; i++){
          setTimeout(() =>{
             document.getElementById(`node-${walls[i][0]}-${walls[i][1]}`).className = `node wall-node`;
          }, 10*i);
       }
    }

    animatePath(){
        let i=0;
        let { startNodePos, endNodePos}= this.state;
        for(let node of this.state.pathNodes){
            if(!(node.row === startNodePos.row && node.col === startNodePos.col) 
               && !(node.row === endNodePos.row && node.col === endNodePos.col)){
              setTimeout(() =>{
                  document.getElementById(`node-${node.row}-${node.col}`).className = 'node path-node';
              }, 10 *i);
            }
            i++;
        }
         
        this.setState({
            isRunning: false
        });
    }

    animateVisitedNodes(){
        let i= 0;
        let {startNodePos, endNodePos}= this.state;
       for(let node of this.state.visitedNodes){
          if(!(node.row === startNodePos.row && node.col === startNodePos.col) 
             && !(node.row === endNodePos.row && node.col === endNodePos.col)){
          setTimeout(() =>{
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node visited-node';
          }, 10*i);
        }
          i++;
       }
       if(i === this.state.visitedNodes.length){
        setTimeout(() => {
          this.animatePath();
        }, 10*i);
       }
    }

    runDijkstra(){
        this.setState({
            isRunning: true
        });
       let {grid, startNodePos, endNodePos} = this.state;
       let startNode = grid[startNodePos.row][startNodePos.col];
       let endNode = grid[endNodePos.row][endNodePos.col];

       this.setState({ 
          visitedNodes: dijkstra(grid, startNode, endNode),
          pathNodes: getNodesInPath(endNode)
       });
       
       setTimeout(() =>{
          this.animateVisitedNodes();
       }, 100);
    }
    
    clearGrid(){
        if(this.state.isRunning)
         return;

         this.clearMazeAndWalls();
        let { startNodePos, endNodePos} = this.state;
            for(let node of this.state.visitedNodes){
               if( (node.row === startNodePos.row && node.col === startNodePos.col) 
                || (node.row === endNodePos.row && node.col === endNodePos.col) )
                continue;

                document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
            }
        setTimeout(() => {
        this.setState({
           grid: setInitialGrid(this.state.startNodePos, this.state.endNodePos),
           visitedNodes: [],
           pathNodes: [],
           walls: [],
           isRunning: false,
           
        });
       }, 10);
    }

    clearPath(){
        if(this.state.isRunning)
         return ;
        let { startNodePos, endNodePos} = this.state;
            for(let node of this.state.pathNodes){
               if( (node.row === startNodePos.row && node.col === startNodePos.col) 
                || (node.row === endNodePos.row && node.col === endNodePos.col) )
                continue;

                document.getElementById(`node-${node.row}-${node.col}`).className = 'node visited-node';
            }
        this.setState({
            pathNodes: [],
            isRunning: false
        });
    }

    generateMaze(event){
        let ele = event.target;
        if(ele.id === 'sparse-maze'){
           this.setState({
            walls: sparseMaze(this.state.startNodePos, this.state.endNodePos)
           });
        }
        else if(ele.id === 'dense-maze'){
            this.setState({
                walls: denseMaze(this.state.startNodePos, this.state.endNodePos)
            });
        }
        setTimeout(() => {
            this.setWalls();
        }, 100);
        
    }
    
    clearMazeAndWalls(){
        if(this.state.isRunning)
          return;

        for(let row=0; row < this.state.grid.length; row++){
            for(let col=0; col < this.state.grid[0].length; col++){
                if(this.state.grid[row][col].isWall){
                    toggleWall(this.state.grid, row, col);
                    document.getElementById(`node-${row}-${col}`).className = 'node';
                }
            }
        }

       setTimeout(() => {
          this.setState({
            walls: [],
            isRunning: false
          });
       }, 100);
    }
    render() {
        return (
            <>
            
             <div className='grid'>
                {
                    this.state.grid.map((row, rowIdx) =>{
                        return (
                            <div key={rowIdx} className="row">
                                {
                                    row.map((node, nodeIdx) => {
                                        return (
                                            <Node
                                             key={nodeIdx}
                                             row={node.row}
                                             col={node.col}
                                             isStart={node.isStart}
                                             isEnd={node.isEnd}
                                             isWall={node.isWall}
                                             onMouseOver={(row, col) => this.handleMouseOver(row, col)}
                                            />
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
             </div>
             <div className='buttons'>
                <section id='run-button'>
                <div className='run-button'>
             <button onClick={this.runDijkstra}>Run</button>
             </div>
             </section>
             <section id='clear-button'>
             <div className='clear-button'>
            <button onClick={this.clearPath}>Clear Path</button>
            <button onClick={this.clearMazeAndWalls}>Clear Maze&Walls</button>
            <button onClick={this.clearGrid}>Clear grid</button>
            </div>
            </section>
            <section id='maze-button'>
            <div className='maze-button'>
            <button id='sparse-maze' onClick={this.generateMaze}>Sparse Maze</button>
            <button id='dense-maze' onClick={this.generateMaze}>Dense Maze</button>
            </div>
            </section>
            <section className='instr'>
                <h2><b>Instructions</b></h2>
                <ul>
                    <li>Mouse over nodes after hitting 'w' key to start adding walls, hit 'x' key when done.</li>
                    <li>To move start node (green) or end node (red), hit 's' key or 'e' key, respectively and mouse over nodes to choose preferred start or end node, hit 'x' key when done. </li>
                </ul>
            </section>
            </div>
            </>
        );
    }
}