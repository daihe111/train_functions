const { convertHTMLToVnode } = require('../../src/parseVNode.js')

describe('api: parseVNode', () => {
  test('convertHTMLToVnode', () => {
    const template = `<div 
      class="div_cls1" 
      id="div_id1"
    >
      <div 
        class="div_cls2" 
        id="div_id2"
      >
        <span 
          class="span_cls1"
        >
        </span>
        <span 
          class="span_cls2"
        >
        </span>
      </div>
    </div>`
    const parsedVNode = convertHTMLToVnode(template)
    const expectedVNode = [{"tag":"div","props":{"class":"div_cls1","id":"div_id1"},"children":[{"tag":"div","props":{"class":"div_cls2","id":"div_id2"},"children":[{"tag":"span","props":{"class":"span_cls1"},"children":[]},{"tag":"span","props":{"class":"span_cls2"},"children":[]}]}]}]
    expect(parsedVNode).toEqual(expectedVNode)
  })
})