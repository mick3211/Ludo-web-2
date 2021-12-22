//terminar check de kill
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

    resetPiecesStyle() {
        for (let piece of this.pieces) {
            piece.face.classList.remove('valid');
            piece.clickEvent = false;
        }
    }

    startPlay() {
        if (game.diceList.length > 0) {
            game.selectedDice = game.diceList[0];
            if (game.avaliablePieces.length === 0) {
                game.useSelectedDice();
                this.startPlay();
            } else if (game.avaliablePieces.length === 1) {
                game.avaliablePieces[0].move(game.useSelectedDice());
                this.startPlay();
            }
        } else {
            this.resetPiecesStyle();
            game.nextPlayer();
        }
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

        dice.face.parentElement.removeChild(dice.face);
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
};

const tableCells = [];
const mainContainer = document.getElementById('main-container');

for (let i = 0; i < 52; i++) {
    const cell = document.getElementById(`cell-${i}`);
    tableCells.push({
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
}

var diceCount = 0;
mainContainer.addEventListener('click', function (ev) {
    if (ev.target === this && !game.lockDiceRoll) {
        const dice = new Dice(6);
        dice.draw(ev.target, ev.layerX, ev.layerY);
        game.diceList.push(dice);
        diceCount++;

        if (diceCount === 3 && dice.value === 6) {
            game.nextPlayer();
            diceCount = 0;
        } else if (dice.value !== 6) {
            game.lockDiceRoll = true;
            game.lockDiceSelect = false;
            game.currentPlayer.startPlay();
            diceCount = 0;
        }
    }
});
