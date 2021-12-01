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

class Dice {
    constructor(sides) {
        this.sides = sides;
        this.face = document.createElement('div');
        this.face.className = 'dice';

        this.face.addEventListener('click', () => (game.selectedDice = this));

        this.roll();
    }

    roll() {
        this.value = Math.round(Math.random() * (this.sides - 1)) + 1;
        return this.value;
    }

    draw(target, x, y) {
        this.face.style.top = y + 'px';
        this.face.style.left = x + 'px';
        target.appendChild(this.face);
    }

    /**
     * @param {number} value
     */
    set value(value) {
        this._value = value;
        this.face.innerText = this._value;
    }

    get value() {
        return this._value;
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

const game = {
    playerList: [],
    diceList: [],
    _selectedDice: null,
    lockDiceRoll: true,
    lockDiceSelect: true,

    addPlayer(player) {
        this.playerList.push(player);
        console.log('Jogador adicionado:', player);
    },

    nextPlayer() {
        const next =
            (this.playerList.indexOf(this.currentPlayer) + 1) %
            this.playerList.length;
        return this.playerList[next];
    },

    /**
     * @param {Dice} dice
     */
    set selectedDice(dice) {
        if (!this.lockDiceSelect) {
            if (this.selectedDice) this.selectedDice.face.className = 'dice';

            dice.face.classList.add('selected');
            this._selectedDice = dice;
        }
    },

    get selectedDice() {
        return this._selectedDice;
    },

    start() {
        if (this.playerList.length < 2) {
            alert(
                'São necessários pelo menos 2 jogadores para iniciar o jogo!'
            );
        } else {
            document.getElementById('start').hidden = true;
            console.log('Jogo Iniciado');
            this.currentPlayer = this.nextPlayer();
            console.log('jogador atual:', this.currentPlayer);
            this.lockDiceRoll = false;
        }
    },
};

const tableCells = [];
const mainContainer = document.getElementById('main-container');

for (let i = 0; i < 52; i++) {
    const cell = document.getElementById(`cell-${i}`);
    tableCells.push(cell);
}

const diceRolledEvent = new Event('diceRolled');

var diceCount = 0;
mainContainer.addEventListener('click', function (ev) {
    if (ev.target === this && !game.lockDiceRoll) {
        const dice = new Dice(6);
        dice.draw(ev.target, ev.layerX, ev.layerY);
        game.diceList.push(dice);
        diceCount++;

        if (dice.value !== 6 || diceCount === 3) {
            game.lockDiceRoll = true;
            game.lockDiceSelect = false;
            diceCount = 0;
            window.dispatchEvent(diceRolledEvent);
        }
    }
});
