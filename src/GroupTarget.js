import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const cardTarget = {
  hover(props, monitor, component) {
    const index = monitor.getItem().index;
    const groupIndex = monitor.getItem().groupIndex;
    const hoverIndex = props.index

    if (groupIndex) { // is a child
      return
    }
    console.log(index, hoverIndex)
    
    if (hoverIndex === index) {
      return
    }

    // Determine rectangle on screen
    // const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

    // Get vertical middle
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    // const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    // const hoverClientY = clientOffset.y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (hoverIndex < index) {
      props.insertAtBottom(hoverIndex, index)
      console.log(props.length)
      monitor.getItem().index = props.length
      monitor.getItem().groupIndex = hoverIndex
    }

    // Dragging upwards
    if (hoverIndex > index) {
      props.insertAtTop(hoverIndex, index)
      monitor.getItem().index = 1
      monitor.getItem().groupIndex = hoverIndex - 1 // as we remove
    }
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
