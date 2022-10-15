const body = document.querySelector('body')
const table = document.querySelector('table')
const tableTr = table.children[0].children
const removedElementsStack = []
const configValues = {
  brakePoint_1: {
    width: 425,
    column: 3,
  },
  brakePoint_2: {
    width: 320,
    column: 2,
  },
}

let countRemovedLastColumn = 0
let countRemovedFirstColumn = 0

function removeLastColumn(element) {
  const removedElements = []

  for (const td of element) {
    const lastChild = td.lastElementChild
    const elementInfo = {
      element: lastChild,
      parentElement: lastChild.parentNode,
      column: 'lastColumn',
    }
    removedElements.push(elementInfo)
    lastChild.remove()
  }
  countRemovedLastColumn += 1
  removedElementsStack.push(removedElements)
}

function removeFirstColumn(element) {
  const removedElements = []

  for (const td of element) {
    const firstChild = td.firstElementChild
    const elementInfo = {
      element: firstChild,
      parentElement: firstChild.parentNode,
      column: 'firstColumn',
    }
    removedElements.push(elementInfo)
    firstChild.remove()
  }
  countRemovedFirstColumn += 1
  removedElementsStack.unshift(removedElements)
}

function addLastColumn() {
  const lastElements = removedElementsStack.pop()
  for (const element of lastElements) {
    element.parentElement.append(element.element)
  }
  countRemovedLastColumn -= 1
}

function addFirstColumn() {
  const lastElements = removedElementsStack.shift()
  for (const element of lastElements) {
    element.parentElement.prepend(element.element)
  }
  countRemovedFirstColumn -= 1
}

function createElement(tagName, classNames = [], textContent = '') {
  const tag = document.createElement(tagName)
  if (classNames.length) {
    for (const className of classNames) {
      tag.classList.add(className)
    }
  }
  tag.textContent = textContent
  return tag
}

function rightRowClickHandler(event) {
  if (countRemovedLastColumn > 0) {
    removeFirstColumn(tableTr)
    addLastColumn()
  }
}

function leftRowClickHandler(event) {
  if (countRemovedFirstColumn > 0) {
    removeLastColumn(tableTr)
    addFirstColumn()
  }
}

const rows = createElement('div', ['rowAria'])
const leftRow = createElement('div', ['rowButton'], '<')
const rightRow = createElement('div', ['rowButton'], '>')
rows.append(leftRow)
rows.append(rightRow)

const observer = new ResizeObserver((entries) => {
  const width = entries[0].contentRect.width
  const tds = tableTr[0].children

  if (
    width < configValues.brakePoint_1.width &&
    !table.parentNode.contains(rows)
  ) {
    table.before(rows)
    rightRow.addEventListener('click', rightRowClickHandler)
    leftRow.addEventListener('click', leftRowClickHandler)
  }
  if (
    width >= configValues.brakePoint_1.width &&
    table.parentNode.contains(rows)
  ) {
    rightRow.removeEventListener('click', rightRowClickHandler)
    leftRow.removeEventListener('click', leftRowClickHandler)
    rows.remove()
  }
  if (
    width < configValues.brakePoint_1.width &&
    tds.length > configValues.brakePoint_1.column
  )
    removeLastColumn(tableTr)
  if (
    width < configValues.brakePoint_2.width &&
    tds.length > configValues.brakePoint_2.column
  )
    removeLastColumn(tableTr)
  if (width >= configValues.brakePoint_1.width && removedElementsStack.length)
    addLastColumn()
  if (
    width >= configValues.brakePoint_2.width &&
    removedElementsStack.length >= configValues.brakePoint_2.column
  )
    addLastColumn()
})

observer.observe(body)
