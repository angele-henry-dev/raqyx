export interface Territory {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface TerritoryTemp {
  left: number;
  top: number;
  direction: number;
}

export const closeTerritory = (
    inProgressTerritory: TerritoryTemp[],
    CONTAINER_WIDTH: number,
    CONTAINER_HEIGHT: number,
    START_LINE: number
  ) => {
  // [
  //   {
  //       "left": -3,
  //       "top": 229,
  //       "direction": 0
  //   },
  //   {
  //       "left": 302,
  //       "top": 229,
  //       "direction": 0
  //   }
  // ]
  // Should add left 302, top -3, direction 3
  //            left -3, top -3, direction 1
  //            left -3, top 229, direction 2
  const endingPaths = [];
  const firstPath = inProgressTerritory[0];
  const lastPath = inProgressTerritory[inProgressTerritory.length-1];
  let left = 0;
  let top = 0;
  const direction = 0;

  if (lastPath.left <= START_LINE || lastPath.left >= CONTAINER_WIDTH) {
    left = lastPath.left;
    top = firstPath.top;
  } else {
    top = lastPath.top;
    left = firstPath.left;
  }
  endingPaths.push({
    left: left,
    top: top,
    direction: direction
  });
  return endingPaths; // 0=right, 1=left, 2=down, 3=up
};
