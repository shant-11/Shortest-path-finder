import React, {Component} from 'react';
import './node.css'

export default class Node extends Component {
    // constructor(props){
    //     super(props);
    // }
    render(){
        const {
            row, 
            col, 
            isStart, 
            isEnd, 
            isWall,
            // onMouseDown,
            // onMouseEnter,
            // onMouseUp,
            // onMouseLeave,
            onMouseOver
            }= this.props;

        const secondClassName = isStart 
                             ? 'start-node'
                             : isEnd
                             ? 'end-node'
                             : isWall
                             ? 'wall-node'
                             : '';
        return(
             <div
               className={`node ${secondClassName}`}
               id={`node-${row}-${col}`}
            //    onMouseDown={() =>onMouseDown(row, col)}
            //    onMouseEnter={() => onMouseEnter(row, col)}
            //    onMouseUp={() => onMouseUp(row, col)}
            //    onMouseLeave={() => onMouseLeave(row, col)}
               onMouseOver={() => onMouseOver(row, col)}
             />
        );
    }
}