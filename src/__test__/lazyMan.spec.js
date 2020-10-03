const { 
  LazyMan,
  nextTick
} = require('../../src/lazyMan.js')

describe('api: lazyMan', () => {
  test('base lazyMan', async () => {
    const arr = []
    LazyMan('Levi', (name) => {
      arr.push(name)
    }).sleep(2, (duration) => {
      arr.push(duration)
    }).eat('apple', (name) => {
      arr.push(name)
    }).sleepFirst(1, (duration) => {
      arr.push(duration)
    })
    await nextTick()
    console.log(arr)
    expect(arr).toEqual([1, 'Levi', 2, 'apple'])
  })
})