// systems/Pathfinder.ts
import EasyStar from "easystarjs";

export default class Pathfinder {
    private easystar: EasyStar.js;

    constructor(grid: number[][]) {
        this.easystar = new EasyStar.js();
        this.easystar.setGrid(grid);
        this.easystar.setAcceptableTiles([1]); // 1 = walkable floor
        this.easystar.enableDiagonals(); // optional
    }

    findPath(startX: number, startY: number, endX: number, endY: number): Promise<{x: number, y: number}[] | null> {
        return new Promise(resolve => {
            this.easystar.findPath(startX, startY, endX, endY, path => {
                resolve(path); // path is array of {x, y} tiles
            });
            this.easystar.calculate();
        });
    }
}
