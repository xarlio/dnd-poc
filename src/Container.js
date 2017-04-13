import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BlockSource from './BlockSource';
import BlockTarget from './BlockTarget';
import GroupTarget from './GroupTarget';
import {deepFreeze} from 'freezr'

const style = {
  width: 400,
};
// export const moveBlocks = (blocks, origin, destination) => {
//   console.log(origin, destination)
//   const dragItem = origin.secondLevelIndex ? blocks[origin.firstLevelIndex][origin.secondLevelIndex] : blocks[origin.firstLevelIndex];
  
//   if (origin.secondLevelIndex !== destination.secondLevelIndex && destination.secondLevelIndex === 0) {
//     // from child to outside
//     return blocks
//       .set(origin.firstLevelIndex, blocks[origin.firstLevelIndex].deleteAt(origin.secondLevelIndex))
//       .insertAt(destination.firstLevelIndex, dragItem)
//   } else if (origin.secondLevelIndex !== destination.secondLevelIndex && origin.firstLevelIndex === destination.firstLevelIndex) {
//     // reorder child
//     return blocks
//       .setIn([origin.firstLevelIndex, origin.secondLevelIndex], blocks[destination.firstLevelIndex][destination.secondLevelIndex])
//       .setIn([destination.firstLevelIndex, destination.secondLevelIndex], dragItem)
//   } else {
//     // moving from top level
//     if (destination.secondLevelIndex === 0) {
//       // moving in top level
//       return blocks
//         .set(origin.firstLevelIndex, blocks[destination.firstLevelIndex])
//         .set(destination.firstLevelIndex, dragItem)
//     } else {
//       // from top level to child
//       return blocks
//         .set(destination.firstLevelIndex, blocks[destination.firstLevelIndex].insertAt(destination.secondLevelIndex, dragItem))
//         .deleteAt(origin.firstLevelIndex)
//     }
//   }
//   return blocks
// }
const moveBlocks = (blocks, groupIndex, origin, destination) => {
  console.log('moveBlocks')
  const originBlock = groupIndex ? blocks[groupIndex][origin] : blocks[origin]
  const destinationBlock = groupIndex ? blocks[groupIndex][destination] : blocks[destination]
  const originPath = groupIndex ? [groupIndex, origin] : [origin]
  const destinationPath = groupIndex ? [groupIndex, destination] : [destination]
  return blocks
    .setIn(originPath, destinationBlock)
    .setIn(destinationPath, originBlock)
}

class Container extends Component {
  constructor(props) {
    super(props);
    this.moveBlocks = this.moveBlocks.bind(this);
    this.state = {
      blocks: deepFreeze(['a', 'b', ['A', 'B', 'C', 'D'], 'c', 'd']),
    };
  }

  moveBlocks (groupIndex, origin, destination) {
    this.setState({
      blocks: moveBlocks(this.state.blocks, groupIndex, origin, destination)
    })
  }

  render() {
    return <div style={style}>
      {this.state.blocks.map((block, index) => (
        block instanceof Array ? this.renderGroup(block, index) : this.renderBlockTarget(block, index)
      ))}
    </div>
  }

  renderGroup (group, groupIndex) {
    return <BlockSource isChild={false} index={groupIndex}>
      {this.renderBlock(group[0], groupIndex)}
      {group.slice(1).map((block, index) => {
        return this.renderBlockTarget(block, index + 1, groupIndex)
      })}
    </BlockSource>
  }

  renderBlockTarget (block, index, groupIndex) {
    return <BlockTarget key={block} index={index} moveBlocks={this.moveBlocks}>
      <BlockSource isChild={!!groupIndex} index={index} groupIndex={groupIndex}>
        {this.renderBlock(block, index, groupIndex)}
      </BlockSource>
    </BlockTarget>
  }
  
  renderBlock (ref, index, groupIndex) {
    return <div>{ref}</div>
  }
}

export default DragDropContext(HTML5Backend)(Container)
