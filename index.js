import Dice from './dice.js';
import Table from './table.js';

export var table = new Table();

export const game = {
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
