import {deepFreeze} from 'freezr'
import {moveBlocks} from './Container'

const blocks = deepFreeze(['1', '2', ['3a', '3b', '3c', '3d'], '4', ['7a', '7b'], 8])

describe('moveBlocks', () => {
  it('top level reorder', () => {
    const result = moveBlocks(blocks, {
      firstLevelIndex: 0,
      secondLevelIndex: 0
    }, {
      firstLevelIndex: 1,
      secondLevelIndex: 0
    })
    expect(result).toEqual(['2', '1', ['3a', '3b', '3c', '3d'], '4', ['7a', '7b'], 8])
  })
  it('childs reorder', () => {
    const result = moveBlocks(blocks, {
      firstLevelIndex: 2,
      secondLevelIndex: 1
    }, {
      firstLevelIndex: 2,
      secondLevelIndex: 2
    })
    expect(result).toEqual(['1', '2', ['3a', '3c', '3b', '3d'], '4', ['7a', '7b'], 8])
  })
  it('from child to outside', () => {
    const result = moveBlocks(blocks, {
      firstLevelIndex: 2,
      secondLevelIndex: 1
    }, {
      firstLevelIndex: 2,
      secondLevelIndex: 0
    })
    expect(result).toEqual(['1', '2', '3b', ['3a', '3c', '3d'], '4', ['7a', '7b'], 8])
  })
  it('from outside to child', () => {
    const result = moveBlocks(blocks, {
      firstLevelIndex: 3,
      secondLevelIndex: 0
    }, {
      firstLevelIndex: 2,
      secondLevelIndex: 4
    })
    expect(result).toEqual(['1', '2', ['3a', '3b', '3c', '3d', '4'], ['7a', '7b'], 8])
  })
  it('reordering a group', () => {
    const result = moveBlocks(blocks, {
      firstLevelIndex: 2,
      secondLevelIndex: 0
    }, {
      firstLevelIndex: 3,
      secondLevelIndex: 0
    })
    expect(result).toEqual(['1', '2', '4', ['3a', '3b', '3c', '3d'], ['7a', '7b'], 8])
  })
})