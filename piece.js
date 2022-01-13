import { table } from './index.js';
import { movePieceState, rollDiceState } from './states.js';
import { game } from './index.js';

class Piece {
    constructor(lockId) {
        this.path = table.mainPath;
        this.lock = document.getElementById(lockId);
        this.face = document.createElement('div');
        this.clickEvent = false;

        this.face.addEventListener('click', () => {
            if (this.clickEvent) {
                this.move(game.useSelectedDice());
                movePieceState();
            }
        });

        this.reset();
    }

    reset() {
        if (this.pos) {
            table.cells[this.pos].popPiece(this);
        }
        this.lock.appendChild(this.face);
        this.pos = -1;
        this.steps = 0;
        this.locked = true;
    }

    unlock() {
        this.path.cells[this.startPos].addPiece(this);
        this.pos = this.startPos;
        console.log('desbloqueado at:', this.pos);
        this.locked = false;
    }
    /////////////////////////////////////////////////////////////
    move(n) {
        console.log('movendo ' + n + ' casas');
        if (this.locked) {
            if (n === 6) {
                this.unlock();
                return true;
            } else return false;
        }

        if (this.steps + n < 57) {
            this.steps = this.steps + n;
            this.path.cells[this.pos].popPiece(this);

            this.pos = (this.pos + n) % 52;
            if (this.steps > 50) {
                this.pos = this.steps - 51;
                this.path = this.finalPath;
            }
            if (this.path.checkForKill(this, this.pos)) {
                rollDiceState();
            }
            this.path.cells[this.pos].addPiece(this);
        } else return false;

        return true;
    }
}

export class GreenPiece extends Piece {
    constructor(lockId) {
        super(lockId);
        this.color = 'green';
        this.startPos = 0;
        this.face.className = 'piece green';
        this.mainPath = table.mainPath;
        this.finalPath = table.greenPath;
    }
}
export class YellowPiece extends Piece {
    constructor(lockId) {
        super(lockId);
        this.color = 'yellow';
        this.startPos = 13;
        this.face.className = 'piece yellow';
        this.mainPath = table.mainPath;
        this.finalPath = table.yellowPath;
    }
}
export class BluePiece extends Piece {
    constructor(lockId) {
        super(lockId);
        this.color = 'blue';
        this.startPos = 26;
        this.face.className = 'piece blue';
        this.mainPath = table.mainPath;
        this.finalPath = table.bluePath;
    }
}
export class RedPiece extends Piece {
    constructor(lockId) {
        super(lockId);
        this.color = 'red';
        this.startPos = 39;
        this.face.className = 'piece red';
        this.mainPath = table.mainPath;
        this.finalPath = table.redPath;
    }
}
