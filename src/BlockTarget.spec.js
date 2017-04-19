import {hover} from './BlockTarget'

const fn = {
  moveBlocks: jest.fn(),
  insertAtTop: jest.fn(),
  insertAtBottom: jest.fn(),
  moveChildToTop: jest.fn(),
  moveChildToBottom: jest.fn()
}

describe('BlockTarget', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  
  describe('moving two blocks', () => {
    const source = {
      index: 2
    }
    const target = {
      index: 1
    }
    it('calls moveBlocks', ()=> {
      hover(source, target, fn)
      expect(fn.moveBlocks).toHaveBeenCalledWith(undefined,2,1)
    })
    it('returns the new index', ()=> {
      const result = hover(source, target, fn)
      expect(result.index).toBe(1)
    })
  })
  describe('moving two blocks inside a group', () => {
    const source = {
      index: 2,
      groupIndex: 5
    }
    const target = {
      index: 1,
      groupIndex: 5
    }
    it('calls moveBlocks', ()=> {
      hover(source, target, fn)
      expect(fn.moveBlocks).toHaveBeenCalledWith(5,2,1)
    })
    it('returns the new index', ()=> {
      const result = hover(source, target, fn)
      expect(result.index).toBe(1)
    })
  })
  describe('moving a block inside a group (downwards)', () => {
    const source = {
      index: 3,
      groupIndex: undefined
    }
    const target = {
      index: 4,
      isGroup: true
    }
    it('calls insertAtTop', () => {
      hover(source, target, fn)
      expect(fn.insertAtTop).toHaveBeenCalledWith(4, 3)
    })
    it('returns the new index and insert a groupIndex', () => {
      const result = hover(source, target, fn)
      expect(result.index).toBe(1)
      expect(result.groupIndex).toBe(3) // target index - 1
    })
  })
  describe('moving a block inside a group (upwards)', () => {
    const source = {
      index: 5,
      groupIndex: undefined
    }
    const target = {
      index: 4,
      isGroup: true,
      childsCount: 10
    }
    it('calls insertAtBottom', () => {
      hover(source, target, fn)
      expect(fn.insertAtBottom).toHaveBeenCalledWith(4, 5)
    })
    it('returns the new index and insert a groupIndex', () => {
      const result = hover(source, target, fn)
      expect(result.index).toBe(10)
      expect(result.groupIndex).toBe(4)
    })
  })
  describe('moving a child outside a group (upwards)', () => {
    const source = {
      index: 1,
      groupIndex: 2
    }
    const target = {
      index: 1
    }
    it('calls moveChildToTop', () => {
      hover(source, target, fn)
      expect(fn.moveChildToTop).toHaveBeenCalledWith(1, 2, 1)
    })
    it('returns the new index and insert a groupIndex', () => {
      const result = hover(source, target, fn)
      expect(result.index).toBe(2)
      expect(result.groupIndex).toBe(undefined)
    })
  })
  describe('moving a child outside a group (downwards)', () => {
    const source = {
      index: 8,
      groupIndex: 2
    }
    const target = {
      index: 3
    }
    it('calls moveChildToBottom', () => {
      hover(source, target, fn)
      expect(fn.moveChildToBottom).toHaveBeenCalledWith(3, 2, 8)
    })
    it('returns the new index and insert a groupIndex', () => {
      const result = hover(source, target, fn)
      expect(result.index).toBe(3)
      expect(result.groupIndex).toBe(undefined)
    })
  })
  describe('moving a group inside another group', () => {
    const source = {
      isGroup: true,
      index: 2
    }
    const target = {
      isGroup: true,
      index: 3
    }
    
    it('does not call any callback', () => {
      hover(source, target, fn)
      Object.keys(fn).forEach((key) => {
        expect(fn[key]).not.toHaveBeenCalled()
      })
    })
  })
})