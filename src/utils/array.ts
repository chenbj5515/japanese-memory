export function getRandomItemsFromArray(array: any[], count: number) {
  const shuffledArray = array.slice(); // 复制数组以避免修改原始数组
  const randomItems = [];

  while (randomItems.length < count && shuffledArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * shuffledArray.length);
    const randomItem = shuffledArray.splice(randomIndex, 1)[0];
    randomItems.push(randomItem);
  }

  return randomItems;
}
