interface StudyObject {
  translation: string;
  kana_pronunciation: string;
  create_time: string;
  id: string;
  needReviewTimes: number;
  original_text: string;
  record_file_path: string;
  review_times: number;
  update_time: string;
  daysAgo?: number;
}

export function getRandomItemsFromArray(objects: StudyObject[]): StudyObject[] {
  const desiredSelections = 20;
  const timeRanges: [number, number][] = [
    [180, 360],
    [90, 180],
    [30, 90],
    [0, 30],
  ]; // days ago

  // Create a new array with added 'daysAgo' property without mutating the original objects.
  const enhancedObjects = objects.map((obj) => ({
    ...obj,
    daysAgo:
      (Date.now() - new Date(obj.create_time).getTime()) /
      (1000 * 60 * 60 * 24),
  }));

  // Sort without mutating the original array.
  const sortedObjects = [...enhancedObjects].sort(
    (a, b) =>
      a.review_times - b.review_times ||
      new Date(b.create_time).getTime() - new Date(a.create_time).getTime()
  );

  let selected: StudyObject[] = [];

  // Function to filter and slice objects based on review_times and daysAgo.
  const filterAndSlice = (
    objects: StudyObject[],
    reviewTimes: number,
    start: number,
    end: number,
    toSelect: number
  ) =>
    objects
      .filter(
        (obj) =>
          obj.review_times === reviewTimes &&
          start <= obj.daysAgo! &&
          obj.daysAgo! < end
      )
      .slice(0, toSelect);

  // Iterate over time ranges to select objects.
  timeRanges.forEach(([start, end]) => {
    const toSelect = Math.floor(desiredSelections / timeRanges.length);
    selected = [
      ...selected,
      ...filterAndSlice(sortedObjects, 0, start, end, toSelect),
    ];
  });

  // Calculate remaining selections and select more if needed.
  const remaining = desiredSelections - selected.length;
  if (remaining > 0) {
    const nonSelectedObjects = sortedObjects.filter(
      (obj) => !selected.find((sel) => sel.id === obj.id)
    );
    timeRanges.forEach(([start, end]) => {
      const toSelect = Math.floor(remaining / timeRanges.length);
      selected = [
        ...selected,
        ...filterAndSlice(nonSelectedObjects, 0, start, end, toSelect),
      ];
    });
  }

  // Fill up with the closest items if still not enough.
  if (selected.length < desiredSelections) {
    const additionalItems = sortedObjects.filter(
      (obj) => !selected.find((sel) => sel.id === obj.id)
    );
    selected = [
      ...selected,
      ...additionalItems.slice(0, desiredSelections - selected.length),
    ];
  }

  return selected.slice(0, desiredSelections); // Ensure only the desired number of items are returned.
}

// Usage: selectObjects(arrayOfStudyObjects);
