export const filterMostRecentByField = (objects: any) => {
  const sortedObjects = [...objects].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const mostRecentEntries = new Map();

  for (const obj of sortedObjects) {
    if (!mostRecentEntries.has(obj.field)) {
      mostRecentEntries.set(obj.field, obj);
    }
  }

  return Array.from(mostRecentEntries.values());
};
