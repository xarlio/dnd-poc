import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BlockSource from './BlockSource';
import BlockTarget from './BlockTarget';
import {deepFreeze} from 'freezr'

const style = {
  width: 400,
};
export const moveBlocks = (blocks, origin, destination) => {
  console.log(origin, destination)
  const dragItem = origin.secondLevelIndex ? blocks[origin.firstLevelIndex][origin.secondLevelIndex] : blocks[origin.firstLevelIndex];
  
  if (origin.secondLevelIndex !== destination.secondLevelIndex && destination.secondLevelIndex === 0) {
    // from child to outside
    return blocks
      .set(origin.firstLevelIndex, blocks[origin.firstLevelIndex].deleteAt(origin.secondLevelIndex))
      .insertAt(destination.firstLevelIndex, dragItem)
  } else if (origin.secondLevelIndex !== destination.secondLevelIndex && origin.firstLevelIndex === destination.firstLevelIndex) {
    // reorder child
    return blocks
      .setIn([origin.firstLevelIndex, origin.secondLevelIndex], blocks[destination.firstLevelIndex][destination.secondLevelIndex])
      .setIn([destination.firstLevelIndex, destination.secondLevelIndex], dragItem)
  } else {
    // moving from top level
    if (destination.secondLevelIndex === 0) {
      // moving in top level
      return blocks
        .set(origin.firstLevelIndex, blocks[destination.firstLevelIndex])
        .set(destination.firstLevelIndex, dragItem)
    } else {
      // from top level to child
      return blocks
        .set(destination.firstLevelIndex, blocks[destination.firstLevelIndex].insertAt(destination.secondLevelIndex, dragItem))
        .deleteAt(origin.firstLevelIndex)
    }
  }
  return blocks
}

class Container extends Component {
  constructor(props) {
    super(props);
    this.moveBlock = this.moveBlock.bind(this);
    this.state = {
      blocks: deepFreeze(['a', 'b', ['A', 'B', 'C', 'D'], 'c', 'd']),
    };
  }

  moveBlock(origin, destination) {
    this.setState({
      blocks: moveBlocks(this.state.blocks, origin, destination)
    })
  }

  render() {
    const { blocks } = this.state;
    let groupCount = 0

    return (
      <div style={style}>
        {blocks.map((item, firstLevelIndex) => {
          const isGroup = item instanceof Array
          if (isGroup) groupCount++
          return <BlockTarget level={0} key={isGroup ? groupCount : item} position={{firstLevelIndex, secondLevelIndex: 0}} moveBlock={this.moveBlock}>
            <BlockSource
              key={item}
              position={{firstLevelIndex, secondLevelIndex: 0}}
              index={firstLevelIndex}
              isChild={false}
            >
              <div>
                {isGroup ? this.renderGroup(item[0], item.slice(1), firstLevelIndex) : this.renderItem(item) }
              </div>
            </BlockSource>
          </BlockTarget>
        })}
      </div>
    )
  }
  renderGroup(parentRef, childs, firstLevelIndex) {
    return <div>
      {this.renderItem(parentRef)}
      {childs.map((child, index)=> {
        const secondLevelIndex = index + 1 // don't count group header
        return <BlockTarget level={1} key={child} position={{firstLevelIndex, secondLevelIndex}} moveBlock={this.moveBlock}>
          <BlockSource
            key={child}
            position={{firstLevelIndex, secondLevelIndex}}
            index={secondLevelIndex}
            isChild={true}
          >
            {this.renderItem(child)}
          </BlockSource>
        </BlockTarget>
        }
      )}
    </div>

  }
  renderItem(item) {
    return <div>{item}</div>
  }
}

export default DragDropContext(HTML5Backend)(Container)
