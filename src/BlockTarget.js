import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const cardTarget = {
  hover(props, monitor, component) {
    const originalPosition = monitor.getItem().position;
    const destinationPosition = props.position

    if (monitor.didDrop()) {
      return
    }

  
    if (props.level === 0 && originalPosition.firstLevelIndex === destinationPosition.firstLevelIndex) {
      return
    }
    if (props.level === 1 && originalPosition.secondLevelIndex === destinationPosition.secondLevelIndex) {
      return
    }

    // if (originalPosition.firstLevelIndex === destinationPosition.firstLevelIndex
    //   && destinationPosition.secondLevelIndex === 0
    //   || originalPosition.secondLevelIndex === 0
    // ) {
    //   return;
    // }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (props.level === 1 && originalPosition.secondLevelIndex < destinationPosition.secondLevelIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (props.level === 1 && originalPosition.secondLevelIndex > destinationPosition.secondLevelIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (props.level === 0 && originalPosition.firstLevelIndex < destinationPosition.firstLevelIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (props.level === 0 && originalPosition.firstLevelIndex > destinationPosition.firstLevelIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveBlock(originalPosition, destinationPosition);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().position.firstLevelIndex = destinationPosition.firstLevelIndex;
    monitor.getItem().position.secondLevelIndex = destinationPosition.secondLevelIndex;
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
