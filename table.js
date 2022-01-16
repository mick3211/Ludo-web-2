class Cell {
    constructor(htmlElement) {
        this.pieces = [];
        this.htmlElement = document.getElementById(htmlElement);
        this.safe = this.htmlElement.hasAttribute('data-safe');
    }

    popPiece(el) {
        this.htmlElement.removeChild(el.face);
        return this.pieces.splice(this.pieces.indexOf(el), 1);
    }

    addPiece(el) {
        this.htmlElement.appendChild(el.face);
        this.pieces.push(el);
    }

    organize() {
        console.log('organizando peças...', this);
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            piece.face.style.transform = `translateX(-${3 * i}px)`;
        }
    }
}

class Path {
    constructor(cells) {
        this.cells = cells;
    }

    checkForKill(piece, n) {
        const cell = this.cells[n];
        console.log('checando casa...', n, cell);

        if (!cell.safe) {
            console.log('não ta safe');
            if (cell.pieces.length === 1) {
                console.log('tem 1 peça');
                if (cell.pieces[0].color !== piece.color) {
                    console.log('cor diferente');
                    cell.pieces[0].reset();
                    return true;
                }
            }
        }
        return false;
    }
}

class Table {
    constructor() {
        this.mainPath = new Path([]);
        this.greenPath = new Path([]);
        this.redPath = new Path([]);
        this.bluePath = new Path([]);
        this.yellowPath = new Path([]);
        this.final = new Cell('final');

        for (let i = 0; i < 52; i++) {
            const cell = new Cell(`cell-${i}`);
            this.mainPath.cells.push(cell);
        }

        for (let color of ['red', 'green', 'blue', 'yellow']) {
            for (let i = 0; i < 5; i++) {
                const cell = new Cell(`${color}-final-${i}`);
                eval(`this.${color}Path.cells.push(cell)`);
            }
            eval(`this.${color}Path.cells.push(this.final)`);
        }
    }
}

export default Table;
