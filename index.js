import Table from './table.js';

export var table = new Table();

class Piece {
    constructor(color, startPos, lockId, mainPath, finalPath) {
        this.startPos = startPos;
        this.mainPath = mainPath;
        this.finalPath = finalPath;
        this.path = mainPath;
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

        for (let i = 0; i < 5; i++) {
            this.finalPath.push({
                htmlElement: document.getElementById(`${color}-final-${i}`),
                pieces: [],
                safe: true,
                popPiece(el) {
                    this.htmlElement.removeChild(el.face);
                    return this.pieces.splice(this.pieces.indexOf(el), 1);
                },
                addPiece(el) {
                    this.htmlElement.appendChild(el.face);
                    this.pieces.push(el);
                },
            });
        }

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
        this.path = table.cells;
    }

    unlock() {
        this.path[this.startPos].addPiece(this);
        this.pos = table.cells.indexOf(this.startCell);
        console.log('desbloqueado at:', this.pos);
        this.locked = false;
    }
    /////////////////////////////////////////////////////////////
    move(n) {
        console.log('movendo', n, (this.pos + n) % 52);
        if (this.locked) {
            if (n === 6) {
                this.unlock();
                return true;
            } else return false;
        }

        if (this.steps + n < 57) {
            this.steps = this.steps + n;
            this.path[this.pos].popPiece(this);

            if (this.steps > 50) {
                console.log('chegou na reta final');
                this.pos = 0;
                this.path = this.finalPath;
                n = n - 51;
            }
            this.pos = (this.pos + n) % 52;
            if (table.checkForKill(this, this.pos)) {
                game.lockDiceRoll = false;
                game.lockDiceSelect = true;
            }
            this.path[this.pos].addPiece(this);
        } else return false;

        return true;
    }
}

class Dice {
    constructor(sides) {
        this.sides = sides;
        this.face = document.createElement('div');
        this.face.className = 'dice';

        this.face.addEventListener('click', () => {
            if (!game.lockDiceSelect) {
                game.selectedDice = this;
            }
        });

        this.roll();
    }

    roll() {
        this.value = Math.round(Math.random() * (this.sides - 1)) + 1;
        //this.value = 6;
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

const game = {
    playerList: [],
    diceList: [],
    _selectedDice: null,
    lockDiceRoll: true,
    lockDiceSelect: true,
    avaliablePieces: null,

    addPlayer(player) {
        this.playerList.push(player);
        console.log('Jogador adicionado:', player);
    },

    nextPlayer() {
        const next =
            (this.playerList.indexOf(this.currentPlayer) + 1) %
            this.playerList.length;

        this.lockDiceRoll = false;
        this.lockDiceSelect = true;

        for (let dice of this.diceList) {
            this.selectedDice = dice;
            this.useSelectedDice;
        }

        this.currentPlayer = this.playerList[next];
        console.log('jogador atual:', this.currentPlayer);
    },

    filterPieces(value) {
        const validPieces = [];
        const playerPieces = this.currentPlayer.pieces;

        this.currentPlayer.resetPiecesStyle();

        playerPieces.forEach(piece => {
            if (
                (!piece.locked && piece.steps + value < 57) ||
                (piece.locked && value === 6)
            ) {
                piece.face.classList.add('valid');
                piece.clickEvent = true;
                validPieces.push(piece);
            }
        });
        this.avaliablePieces = validPieces;
    },

    useSelectedDice() {
        const dice = this.selectedDice;

        dice.face.remove();
        this.currentPlayer.resetPiecesStyle();
        return this.diceList.splice(this.diceList.indexOf(dice), 1)[0].value;
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

        this.filterPieces(dice.value);
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
            this.lockDiceRoll = false;
            document.getElementById('start').hidden = true;
            console.log('Jogo Iniciado');
            this.currentPlayer = this.playerList[0];
            console.log('jogador atual:', this.currentPlayer);
        }
    },

    clearDices() {
        for (let dice of this.diceList) {
            dice.face.remove();
        }
        this.diceList = [];
    },
};

/*const table = {
    cells: [],

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
    },
};

for (let i = 0; i < 52; i++) {
    const cell = document.getElementById(`cell-${i}`);
    table.cells.push({
        htmlElement: cell,
        pieces: [],
        safe: cell.hasAttribute('data-safe'),
        popPiece(el) {
            this.htmlElement.removeChild(el.face);
            return this.pieces.splice(this.pieces.indexOf(el), 1);
        },
        addPiece(el) {
            this.htmlElement.appendChild(el.face);
            this.pieces.push(el);
        },
    });
}*/

const mainContainer = document.getElementById('main-container');
var diceCount = 0;
mainContainer.addEventListener('click', function (ev) {
    if (ev.target === this && !game.lockDiceRoll) {
        const dice = new Dice(6);
        dice.draw(ev.target, ev.layerX, ev.layerY);
        game.diceList.push(dice);

        if (++diceCount === 3 && dice.value === 6) {
            game.clearDices();
            diceCount = 0;
            game.nextPlayer();
        } else if (dice.value !== 6) {
            game.lockDiceRoll = true;
            game.lockDiceSelect = false;
            game.currentPlayer.startPlay();
            diceCount = 0;
        }
    }
});
