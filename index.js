const { LazyMan } = require('./src/lazyMan.js');
const { convertHTMLToVnode } = require('./src/parseVNode.js');

LazyMan('tom').sleep(5).eat('banana').sleepFirst(3);
console.log(
  JSON.stringify(
    convertHTMLToVnode(
      `<div 
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
    )
  )
);