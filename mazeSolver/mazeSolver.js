let maze = [
  ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['+', '+', '#', '+', '#', '#', '+', '#', '#'],
  ['#', '+', '#', '+', '#', '+', '+', '+', '#'],
  ['#', '+', '#', '+', '#', '#', '+', '#', '#'],
  ['#', '+', '#', '+', '0', '+', '+', '#', '#'],
  ['#', '+', '+', '+', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '+'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
];

class MazeSolver {
  constructor(maze) {
    this.maze = maze;
    this.mazeStartSymbols = ['0', 'O'];
    this.numStartPoints = 0;

    this.mazeStartCoordinate = [];
    this.mazeEndCoordinates = [];
    this.solution = [];
  }

  init() {
    this.findMazeStart();
    this.findMazeEnds();
    this.traverse(this.mazeStartCoordinate, this.mazeEndCoordinates, '+', '$');
  }

  findMazeStart() {
    // find the start of the maze, if there are two of them - throw an error
    for (let row = 0; row < this.maze.length; row++) {
      for (let col = 0; col < this.maze[row].length; col++) {
        if (this.mazeStartSymbols.includes(this.maze[row][col])) {
          this.numStartPoints++;

          if (this.numStartPoints != 1) {
            throw 'There can be only 1 starting point!';
          } else {
            this.mazeStartCoordinate = { y: row, x: col };
          }
        }
      }
    }

    // console.log(`Start is at ${JSON.stringify(this.mazeStartCoordinate)}.`);
  }

  findMazeEnds() {
    // find all of the coordinates that may be exits
    for (let col = 0; col < this.maze[0].length; col++) {
      if (this.maze[0][col].includes('+')) {
        this.mazeEndCoordinates.push({ y: 0, x: col });
      }
    }

    for (let col = 0; col < this.maze[0].length; col++) {
      if (this.maze[this.maze.length - 1][col].includes('+')) {
        this.mazeEndCoordinates.push({ y: this.maze.length - 1, x: col });
      }
    }

    for (let row = 0; row < this.maze.length; row++) {
      if (this.maze[row][0].includes('+')) {
        this.mazeEndCoordinates.push({ y: row, x: 0 });
      }
    }

    for (let row = 0; row < this.maze.length; row++) {
      if (this.maze[row][this.maze[row].length - 1].includes('+')) {
        this.mazeEndCoordinates.push({ y: row, x: this.maze[row].length - 1 });
      }
    }

    // console.log(
    //   `Possible ends are at ${JSON.stringify(this.mazeEndCoordinates)}.`
    // );
  }

  getValidDir(cord, symbol) {
    // get all of the available paths
    const { x, y } = cord;

    let cords = [];

    if (this.maze[y][x + 1] !== undefined) {
      cords.push({
        y: y,
        x: x + 1,
        val: this.maze[y][x + 1],
        direction: 'right',
      });
    }
    if (this.maze[y + 1] !== undefined) {
      cords.push({
        y: y + 1,
        x: x,
        val: this.maze[y + 1][x],
        direction: 'bottom',
      });
    }
    if (this.maze[y][x - 1] !== undefined) {
      cords.push({
        y: y,
        x: x - 1,
        val: this.maze[y][x - 1],
        direction: 'left',
      });
    }
    if (this.maze[y - 1] !== undefined) {
      cords.push({
        y: y - 1,
        x: x,
        val: this.maze[y - 1][x],
        direction: 'top',
      });
    }

    return cords.filter((el) => el.val === symbol || el.val === '+');
  }

  traverse(start, ends, pathSymbol, visitedSymbol) {
    // get available directions
    let directions = this.getValidDir(start, pathSymbol);

    // mark the coordinate as visited, but if it was visited already (backtracking path), and if there is only 1 path available  - mark it as forbidden
    if (directions.length > 1 && pathSymbol == '$') {
    } else {
      // UNCOMMENT IF YOU WOULD LIKE TO SEE THE PATH TAKEN EACH STEP
      //console.log(this.maze.join('\n'));
      //console.log('\n');
      this.maze[start.y][start.x] = visitedSymbol;
    }

    // check if the coordinate matches the exit coordinates, loop is added in cases there are fake exits, output the solution
    let currentCoordinate = JSON.parse(JSON.stringify(start));
    delete currentCoordinate.val;
    delete currentCoordinate.direction;

    for (let j = 0; j < ends.length; j++) {
      if (JSON.stringify(currentCoordinate) == JSON.stringify(ends[j])) {
        throw this.solution;
      }
    }

    // while backtracking, return back to an unvisited path whenever it is available
    let checkForNewPath = this.getValidDir(start, '+');

    if (checkForNewPath.length > 0 && pathSymbol == '$') {
      this.traverse(start, ends, '+', '$');
    }

    // traverse forward the maze (clockwise starting from the right)
    if (directions.length > 0) {
      const currentDirection = directions[0];

      // add the taken direction to the SOLUTION, delete the last taken step if stumbled upon a dead end and traversing back
      if (pathSymbol == '+') {
        this.solution.push(currentDirection.direction);
      } else {
        let deletedPath = this.solution.pop();
      }

      // start the new loop of traversing
      this.traverse(currentDirection, ends, pathSymbol, visitedSymbol);
    } else {
      // if no paths available during the loop, start traversing back
      let checkForVisitedPath = this.getValidDir(start, '$');

      if (checkForNewPath.length > 0) {
        // this part of the if statement is not required, since we have called the function previously if the new path is available
        this.traverse(start, ends, '+', '$');
      } else if (checkForVisitedPath.length > 0) {
        this.traverse(start, ends, '$', '@');
      } else {
        // if there are no '+' or '$' paths, and all of the other directions where checked previously, throw the error.
        throw 'The maze does not have a solution.';
      }
    }
  }
}

try {
  const newMaze = new MazeSolver(maze);
  newMaze.init();
} catch (err) {
  console.error(err);
}
