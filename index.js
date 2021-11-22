class Piece {
    constructor(color, startCellId, lockId) {
        this.startCell = document.getElementById(startCellId);
        this.lock = document.getElementById(lockId);
        this.face = document.createElement('div');
        this.face.className = `piece ${color}`;
    }

    reset() {
        this.lock.appendChild(this.face);
        this.steps = 0;
        this.locked = true;
    }
}

class Player {
    constructor(name, color, pieceStartCellId) {
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
    constructor() {
        this.playerList = [];
    }

    addPlayer(player) {
        if (this.playerList.length < 4) {
            this.playerList.push(player);

            for (let piece of player.pieces) {
                piece.reset();
            }

            console.log('Jogador adicionado:', player);
        }
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
