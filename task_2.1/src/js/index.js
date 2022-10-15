const timesLists = document.querySelectorAll(".list__times");
const moreElementsText = "ещё...";

function calcWidth(elementArray) {
  return elementArray.reduce((acc, item) => {
    const computeditem = getComputedStyle(item);
    const marginRight = parseInt(computeditem.marginRight);
    const marginLeft = parseInt(computeditem.marginLeft);
    acc += item.offsetWidth + marginRight + marginLeft;
    return acc;
  }, 0);
}

function removeLastElement(elements) {
  const lastElement = elements[elements.length - 1];
  lastElement.remove();
  return lastElement;
}

for (const timesList of timesLists) {
  const timesListElements = timesList.children;
  const timesListWidth = timesList.offsetWidth;
  const removedElements = [];
  let moreElementsButton;

  let timesListElementsWidth = calcWidth([...timesListElements]);

  while (timesListElementsWidth > timesListWidth) {
    const removedElement = removeLastElement(timesListElements);
    removedElements.push(removedElement);
    timesListElementsWidth = calcWidth([...timesListElements]);
  }

  if (removedElements.length) {
    const removedElement = removeLastElement(timesListElements);
    removedElements.push(removedElement);
    moreElementsButton = removedElement.cloneNode();
    moreElementsButton.textContent = moreElementsText;
    timesList.append(moreElementsButton);
    moreElementsButton.addEventListener("click", () => {
      while (removedElements.length) {
        moreElementsButton.removeEventListener("click", moreElementsButton);
        moreElementsButton.remove();
        const lastElement = removedElements.pop();
        timesList.append(lastElement);
      }
    });
  }
}
