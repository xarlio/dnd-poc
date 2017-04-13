import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CardSource from './CardSource';
import CardTarget from './CardTarget';

const style = {
  width: 400,
};

class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      cards: ['a', 'b', ['A', 'B', 'C', 'D'], 'c', 'd'],
    };
  }

  moveCard(origin, destination) {
    const { cards } = this.state;
    const dragCard = origin.secondLevelIndex ? cards[origin.firstLevelIndex][origin.secondLevelIndex] : cards[origin.firstLevelIndex];
    if (!dragCard) {
      return
    }
    console.log(origin, destination)
    if (origin.firstLevelIndex === destination.firstLevelIndex) {
      cards[origin.firstLevelIndex][origin.secondLevelIndex] = cards[destination.firstLevelIndex][destination.secondLevelIndex]
      cards[destination.firstLevelIndex][destination.secondLevelIndex] = dragCard
    } else {
      if (origin.secondLevelIndex === destination.secondLevelIndex) {
        cards[origin.firstLevelIndex] = cards[destination.firstLevelIndex]
        cards[destination.firstLevelIndex] = dragCard
      } else {
        if (destination.secondLevelIndex === 0) {
          // from  inside to outside
          console.log('from inside to outside')
          cards[origin.firstLevelIndex].splice(origin.secondLevelIndex, 1)
          cards.splice(destination.firstLevelIndex, 0, dragCard)
        } else {
          // from outside to inside
          console.log('from outside to inside')
          cards[destination.firstLevelIndex].splice(destination.secondLevelIndex, 0, dragCard)
          cards.splice(origin.firstLevelIndex, 1)

        }
      }
    }
      
    console.log('r', cards.concat())
    this.setState({
      cards: cards.concat()
    })
  }

  render() {
    const { cards } = this.state;
    let groupCount = 0

    return (
      <div style={style}>
        {cards.map((item, firstLevelIndex) => {
          const isGroup = item instanceof Array
          if (isGroup) groupCount++
          return <CardTarget level={0} key={isGroup ? groupCount : item} position={{firstLevelIndex, secondLevelIndex: 0}} moveCard={this.moveCard}>
            <CardSource
              key={item}
              position={{firstLevelIndex, secondLevelIndex: 0}}
              index={firstLevelIndex}
              isChild={false}
            >
              <div>
                {isGroup ? this.renderGroup(item[0], item.slice(1), firstLevelIndex) : this.renderItem(item) }
              </div>
            </CardSource>
          </CardTarget>
        })}
      </div>
    )
  }
  renderGroup(parentRef, childs, firstLevelIndex) {
    return <div>
      {this.renderItem(parentRef)}
      {childs.map((child, secondLevelIndex)=> (
        <CardTarget level={1} key={child} position={{firstLevelIndex, secondLevelIndex}} moveCard={this.moveCard}>
          <CardSource
            key={child}
            position={{firstLevelIndex, secondLevelIndex: secondLevelIndex + 1}}
            index={secondLevelIndex}
            isChild={true}
          >
            {this.renderItem(child)}
          </CardSource>
        </CardTarget>
        )
      )}
    </div>

  }
  renderItem(item) {
    return <div>{item}</div>
  }
}

export default DragDropContext(HTML5Backend)(Container)
