class Piece {
    constructor(color, startCellId, lockId) {
        this.startCell = document.getElementById(startCellId);
        this.lock = document.getElementById(lockId);
        this.face = document.createElement('div');
        this.face.className = `piece ${color}`;

        this.reset();
    }

    reset() {
        this.lock.appendChild(this.face);
        this.pos = -1;
        this.steps = 0;
        this.locked = true;
    }

    unlock() {
        this.startCell.appendChild(this.face);
        this.pos = this.startCell.id.match(/\d+/).at(0);
        this.locked = false;
    }

    move(n) {
        if (this.locked) {
            if (n === 6) {
                this.unlock();
                return true;
            } else return false;
        }

        tableCells[(this.pos + n) % 52].appendChild(this.face);
        //check cells
        this.pos = (this.pos + n) % 52;
        //check cells
        return true;
    }
}

class Player {
    constructor(name, color, pieceStartCellId) {
        if (game.playerList.length >= 4) {
            throw new Error('Número máximo de jogadores atingido');
        }

        this.name = name;
        this.color = color;
        this.pieces = [
            new Piece(color, pieceStartCellId, `${color}-lock-0`),
            new Piece(color, pieceStartCellId, `${color}-lock-1`),
            new Piece(color, pieceStartCellId, `${color}-lock-2`),
            new Piece(color, pieceStartCellId, `${color}-lock-3`),
        ];

        game.addPlayer(this);
    }
}

class Game {
    #instance = null;

    constructor() {
        if (this.#instance) {
            return this.#instance;
        }
        this.#instance = this;
        this.playerList = [];
    }

    addPlayer(player) {
        this.playerList.push(player);
        console.log('Jogador adicionado:', player);
    }

    start(button) {
        if (this.playerList.length < 2) {
            alert(
                'São necessários pelo menos 2 jogadores para iniciar o jogo!'
            );
        } else {
            console.log('Jogo Iniciado');
            button.hidden = true;
        }
    }
}

function showPlayerForm(card) {
    card.classList.add('no-before');
    const form = card.firstElementChild;
    form.hidden = false;
}

function createPlayerFromCard(form, color, pieceStartCellId) {
    const disable = document.createAttribute('disabled');
    new Player(form.firstElementChild.value, color, pieceStartCellId);
    form.removeChild(form.lastElementChild);
    form.firstElementChild.setAttributeNode(disable);
}

const game = new Game();
const tableCells = [];

for (let i = 0; i < 52; i++) {
    const cell = document.getElementById(`cell-${i}`);
    tableCells.push(cell);
}
