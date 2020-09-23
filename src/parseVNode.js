
function convertHTMLToVnode(xmlString) {
  //实现过程
  const parseContext = {
    startReg: /<([a-zA-Z]+)(\s+[a-zA-Z]+="[^<>]*")*>/i,
    endReg: /<\/([a-zA-Z]+)>/i,
    originalSource: xmlString,
    source: xmlString,
    currentPosition: 0
  };
  return createRootNode(parseContext);
}

// 创建根节点
function createRootNode(parseContext) {
  const nodeStack = [];
  const children = parseChildren(parseContext, nodeStack);
  const vnode = {
    tag: 'root',
    children
  };
  return normalizeRootNode(vnode);
}

// 推进解析器指针
function advanceTemplate(number, parseContext) {
  const { source } = parseContext;
  parseContext.source = source.slice(number);
}

// 解析标签属性
function parseProps(propsStr) {
  const props = Object.create(null);
  if (!propsStr) {
    return props;
  }
  const propsArr = propsStr.trim().split(/\s+/);
  for (let i = 0; i < propsArr.length; i++) {
    const [name, value] = propsArr[i].split('=');
    props[name] = value;
  }
  return props;
}

// 是否闭合
function isEnd(parseContext, nodeStack) {
  // case1: 有父节点的情况
  const { source } = parseContext;
  const parentNode = nodeStack[nodeStack.length - 1];
  if (parentNode) {
    const { tag: parentTag } = parentNode;
    return (
      source.startsWith('</') && 
      source.substr(2, parentTag.length) === parentTag && 
      source[parentTag.length + 2] === '>'
    );
  }
  return !source;
}

// 解析子代节点
function parseChildren(parseContext, nodeStack) {
  const nodes = [];
  while (!isEnd(parseContext, nodeStack)) {
    // 逐个解析element
    const node = parseElement(parseContext, nodeStack);
    nodes.push(node);
  }
  return nodes;
}

// 解析单个element
function parseElement(parseContext, nodeStack) {
  const {
    source,
    startReg,
    endReg
  } = parseContext;
  // parse start tag
  const matchStart = startReg.exec(source);
  const tag = matchStart[1];
  const props = parseProps(matchStart[2]);
  advanceTemplate(matchStart[0].length, parseContext);
  
  // parse children
  const currentVNode = {
    tag,
    props
  };
  nodeStack.push(currentVNode);
  const children = parseChildren(parseContext, nodeStack);
  currentVNode.children = children;
  nodeStack.pop();

  // parse end tag
  const matchEnd = endReg.exec(source);
  advanceTemplate(matchEnd[0].length, parseContext);

  return currentVNode;
}

function normalizeRootNode(rootNode) {
  const { children } = rootNode;
  if (Array.isArray(children)) {
    if (children.length) {
      return children;
    }
    return children[0];
  }
  return children;
}

console.log(JSON.stringify(convertHTMLToVnode('<div class="div_cls"><span class="span_cls"></span></div>')));