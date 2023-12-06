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
  const tempPath = {
    left: left,
    top: top,
    direction: direction
  };
  endingPaths.push(tempPath);
  if (firstPath.left != left || firstPath.top != top) {
    if ((lastPath.left <= START_LINE || lastPath.left >= CONTAINER_WIDTH)) {
      if (lastPath.top < CONTAINER_HEIGHT/2) {
        // On monte
      } else {
        // On descend
      }
    } else {
      if (lastPath.left < CONTAINER_WIDTH/2) {
        // On va à gauche
      } else {
        // On va à droite
      }
    }
  }
  return endingPaths; // 0=right, 1=left, 2=down, 3=up
};
