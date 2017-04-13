import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
      position: props.position
    };
  },
};

class Card extends Component {
  render() {
    const { text, isDragging, connectDragSource, isChild, children } = this.props;
    const opacity = isDragging ? 0 : 1;
    const paddingLeft = isChild ? 20 : 0

    return connectDragSource(
      <div style={{ ...style, opacity, paddingLeft }}>
        {children}
      </div>,
    );
  }
}

export default DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Card)
