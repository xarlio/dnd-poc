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

const moveBlocks = (blocks, groupIndex, origin, destination) => {
  console.log('moveBlocks', groupIndex, origin, destination)
  const originBlock = groupIndex>=0 ? blocks[groupIndex][origin] : blocks[origin]
  const destinationBlock = groupIndex>=0 ? blocks[groupIndex][destination] : blocks[destination]
  const originPath = groupIndex>=0 ? [groupIndex, origin] : [origin]
  const destinationPath = groupIndex>=0 ? [groupIndex, destination] : [destination]
  return blocks
    .setIn(originPath, destinationBlock)
    .setIn(destinationPath, originBlock)
}

const insertAtTop = (blocks, groupIndex, origin) => {
  console.log('insertAtTop')
  return blocks
    .set(groupIndex, blocks[groupIndex].insertAt(1, blocks[origin]))
    .deleteAt(origin)
}

const insertAtBottom = (blocks, groupIndex, origin) => {
  console.log('insertAtBottom')
  return blocks
    .set(groupIndex, blocks[groupIndex].push(blocks[origin]))
    .deleteAt(origin)
}

const preserveAtLeastOneChild = (blocks) => {
  if (blocks.length <= 1) {
    return blocks.push('undefined' + Math.random())
  }
  return blocks
}

const moveChildToTop = (blocks, destination, originGroupIndex, originIndex) => {
  console.log('moveChildToTop', destination, originGroupIndex, originIndex)
  const destinationBlock = blocks[originGroupIndex][originIndex]
  return blocks
    .set(originGroupIndex, preserveAtLeastOneChild(blocks[originGroupIndex].deleteAt(1)))
    .insertAt(destination + 1, destinationBlock)
}

const moveChildToBottom = (blocks, destination, originGroupIndex, originIndex) => {
  console.log('moveChildToBottom', destination, originGroupIndex, originIndex)
  const destinationBlock = blocks[originGroupIndex][originIndex]
  return blocks
    .set(originGroupIndex, preserveAtLeastOneChild(blocks[originGroupIndex].deleteAt(blocks[originGroupIndex].length - 1)))
    .insertAt(destination, destinationBlock)
}

class Container extends Component {
  constructor(props) {
    super(props)
    this.moveBlocks = this.moveBlocks.bind(this)
    this.insertAtTop = this.insertAtTop.bind(this)
    this.insertAtBottom = this.insertAtBottom.bind(this)
    this.moveChildToTop = this.moveChildToTop.bind(this)
    this.moveChildToBottom = this.moveChildToBottom.bind(this)
    this.state = {
      blocks: deepFreeze(['a', 'b', ['A', 'B', 'C', 'D'], 'c', ['AA', 'BB', 'CC', 'DD'], 'd']),
    }
  }

  moveBlocks (groupIndex, origin, destination) {
    this.setState({
      blocks: moveBlocks(this.state.blocks, groupIndex, origin, destination)
    })
  }
  
  moveChildToTop (destination, originGroupIndex, originIndex) {
    this.setState({
      blocks: moveChildToTop(this.state.blocks, destination, originGroupIndex, originIndex)
    })
  }

  moveChildToBottom (destination, originGroupIndex, originIndex) {
    this.setState({
      blocks: moveChildToBottom(this.state.blocks, destination, originGroupIndex, originIndex)
    })
  }

  insertAtTop (groupIndex, origin) {
    this.setState({
      blocks: insertAtTop(this.state.blocks, groupIndex, origin)
    })
  }

  insertAtBottom (groupIndex, origin) {
    this.setState({
      blocks: insertAtBottom(this.state.blocks, groupIndex, origin)
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
    return <BlockTarget isGroup key={group[0]} index={groupIndex} childsCount={group.length} moveBlocks={this.moveBlocks} moveChildToTop={this.moveChildToTop} moveChildToBottom={this.moveChildToBottom} insertAtTop={this.insertAtTop} insertAtBottom={this.insertAtBottom}>
      <BlockSource isGroup index={groupIndex}>
        {this.renderBlock(group[0], groupIndex)}
        {group.slice(1).map((block, index) => {
          return this.renderBlockTarget(block, index + 1, groupIndex)
        })}
      </BlockSource>
    </BlockTarget>
  }

  renderBlockTarget (block, index, groupIndex) {
    return <BlockTarget groupIndex={groupIndex} key={block} index={index} moveBlocks={this.moveBlocks} moveChildToTop={this.moveChildToTop} moveChildToBottom={this.moveChildToBottom} insertAtTop={this.insertAtTop} insertAtBottom={this.insertAtBottom}>
      <BlockSource isChild={groupIndex>=0} index={index} groupIndex={groupIndex}>
        {this.renderBlock(block, index, groupIndex)}
      </BlockSource>
    </BlockTarget>
  }

  renderBlock (ref, index, groupIndex) {
    return <div>{ref}</div>
  }
}

export default DragDropContext(HTML5Backend)(Container)
