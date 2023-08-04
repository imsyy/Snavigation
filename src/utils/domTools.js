/**
 * 查找页面中所有元素的最大 z-index 值，并返回新元素应该使用的合适 z-index 值
 * @param {number} min - 可选参数，新元素应该至少具有的最小 z-index 值。
 * @returns {number} 返回新元素应该使用的合适 z-index 值。
 */
export const findMaxZIndex = (min) => {
  const elements = document.getElementsByTagName("*");
  let maxZIndex = 0;
  for (let i = 0; i < elements.length; i++) {
    const zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex, 10);
    if (zIndex && zIndex > maxZIndex) {
      maxZIndex = zIndex;
    }
  }
  // 返回新元素应该使用的合适 z-index 值。如果传入了最小值 min，则使用 min，否则使用 2000。
  return Math.max(min ? min : 2000, maxZIndex + 1);
};
