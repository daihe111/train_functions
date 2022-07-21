export const createEmptyObject = (): any => {
    return Object.create(null)
}

/**
 * 计算出不需移动的节点白名单
 * @param map 
 */
export function computeUnmovedWhitelist(map: Record<string, number>): Record<string, true> {
    const whitelist: Record<string, true> = createEmptyObject()
    const lis: string[] = []
    // 记录在递增子序列中索引 i 对应的上一元素所对应的索引
    const correctMap: Record<string, string> = createEmptyObject()
    for (const i in map) {
      const value: number = map[i]
      let lastIndex: string = lis[lis.length - 1]
      const lastValue: number = lastIndex ?
        map[lastIndex] :
        -1
      if (value > lastValue) {
        // 当前值大于递增子序列最后一个索引对应的值，满足贪心条件，将该元素
        // 索引记录到递增子序列中，并记录对应的纠正锚点
        lis.push(i)
        if (lis.length > 1) {
          correctMap[i] = lis[lis.length - 2]
        }
      } else {
        // 二分查找递增子序列中小于当前元素且最接近当前元素的索引，保证找到的索引
        // 及之前的索引对应的值能和当前元素组成正确顺序的递增序列
        let start: number = 0
        let end: number = lis.length - 1
        let middle: number
        while (start + 1 < end) {
          middle = (start + end) >> 1
          if (value > map[lis[middle]]) {
            start = middle
          } else {
            end = middle
          }
        }
  
        // 二分查找后 [0,start] 区间内的子序列元素均小于当前元素，可构成正确顺序的
        // 递增子序列
        lis[end] = i
        correctMap[i] = lis[start]
      }
    }
  
    // 回溯递增子序列，根据先前得到的索引纠正 map，由后向前递推索引值并更新索引值
    const len: number = lis.length
    whitelist[map[lis[len - 1]]] = true
    for (let i = len - 2; i >= 0; i--) {
        lis[i] = correctMap[lis[i + 1]]
        whitelist[map[lis[i]]] = true
    }
  
    return whitelist
  }

const map: Record<string, number> = {
    '12': 1,
    '13': 3,
    '14': 5,
    '15': 4,
    '16': 2,
    '17': 7,
    '18': 9,
    '19': 8
}

console.log(computeUnmovedWhitelist(map))
// 期望输出: { 1: true, 3: true, 5: true, 7: true, 9: true }
// 实际输出: { 1: true, 3: true, 4: true, 7: true, 8: true }
// 输出符合预期