import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const cardTarget = {
  hover(props, monitor, component) {
    const index = monitor.getItem().index;
    const groupIndex = monitor.getItem().groupIndex;
    const isGroup = monitor.getItem().isGroup;
    const hoverIndex = props.index

    if (isGroup) { // cannot have nested groups
      return
    }

    if (groupIndex >= 0) { // is a child
      return
    }
    
    if (hoverIndex === index) {
      return
    }

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
      monitor.getItem().groupIndex = hoverIndex - 1 // as we remove the previous block of the group, the group gets another index
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
