import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const cardTarget = {
  hover(props, monitor, component) {
    const target = {
      isGroup: props.isGroup,
      index: props.index,
      childsCount: props.childsCount
    }
    const source = {
      isGroup: monitor.getItem().isGroup,
      index: monitor.getItem().index,
      groupIndex: monitor.getItem().groupIndex
    }

    if (target.isGroup) {
      if (source.isGroup) { // cannot have nested groups
        return
      }

      if (source.groupIndex >= 0) { // is a child
        return
      }
      
      if (target.index === source.index) {
        return
      }

      // Dragging downwards
      if (target.index < source.index) {
        props.insertAtBottom(target.index, source.index)
        monitor.getItem().index = target.childsCount
        monitor.getItem().groupIndex = target.index
      }

      // Dragging upwards
      if (target.index > source.index) {
        props.insertAtTop(target.index, source.index)
        monitor.getItem().index = 1
        monitor.getItem().groupIndex = target.index - 1 // as we remove the previous block of the group, the group gets another index
      }
      return
    }
    if (!props.inAGroup && source.groupIndex>=0) { // moving a child outside
      if (target.index < source.groupIndex) {
        props.moveChildToTop(target.index, source.groupIndex, source.index)
        monitor.getItem().index = target.index + 1
      } else {
        props.moveChildToBottom(target.index, source.groupIndex, source.index)
        monitor.getItem().index = target.index
      }
      monitor.getItem().groupIndex = undefined
      return
    }
    if (target.index === source.index) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (target.index < source.index && hoverClientY > hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (target.index > source.index && hoverClientY < hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveBlocks(source.groupIndex, source.index, target.index)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = target.index
  },
};

class CardTarget extends Component {
  render() {
    const { connectDropTarget, children } = this.props;
    
    return connectDropTarget(
      <div>
        {children}
      </div>,
    );
  }
}

export default DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))(CardTarget)
