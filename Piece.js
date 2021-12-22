//Terminar check de comer
class Piece {
    constructor(color, startCellId, lockId) {
        this.startCell = tableCells[startCellId];
        this.color = color;
        this.lock = document.getElementById(lockId);
        this.face = document.createElement('div');
        this.face.className = `piece ${color}`;
        this.clickEvent = false;

        this.face.addEventListener('click', () => {
            if (this.clickEvent) {
                this.move(game.useSelectedDice());
                game.currentPlayer.startPlay();
            }
        });

        this.reset();
    }

    reset() {
        if (this.pos) {
            tableCells[this.pos].popPiece(this);
        }
        this.lock.appendChild(this.face);
        this.pos = -1;
        this.steps = 0;
        this.locked = true;
    }

    unlock() {
        this.startCell.addPiece(this);
        this.pos = tableCells.indexOf(this.startCell);
        console.log('desbloqueado at:', this.pos);
        this.locked = false;
    }

    move(n) {
        console.log('movendo', n, (this.pos + n) % 52);
        if (this.locked) {
            if (n === 6) {
                this.unlock();
                return true;
            } else return false;
        }

        tableCells[this.pos].popPiece(this);
        //check cells
        this.pos = (this.pos + n) % 52;
        tableCells[this.pos].addPiece(this);
        //check cells
        return true;
    }

    checkForKill() {
        const cell = tableCells[this.pos];

        if (!cell.safe) {
            if (cell.pieces.length === 1) {
                if (cell.pieces[0].color !== this.color) {
                    cell.pieces[0].reset();
                    return true;
                }
            }
        }
        return false;
    }
}
