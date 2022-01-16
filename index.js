import Table from './table.js';
import { rollDiceState, lockDiceSelect } from './states.js';

export var table = new Table();

//logica para finalizar o jogo
export const game = {
    playerList: [],
    diceList: [],
    _selectedDice: null,

    addPlayer(player) {
        this.playerList.push(player);
        console.log('Jogador adicionado:', player);
    },

    nextPlayer() {
        if (this.playerList.length === 1) return;

        document
            .getElementById(`${this.currentPlayer.color}-card`)
            .classList.remove('valid');
        this.currentPlayerId =
            (this.currentPlayerId + 1) % this.playerList.length;

        this.clearDices();
        this.checkWinner();

        this.currentPlayer = this.playerList[this.currentPlayerId];
        if (this.currentPlayer.win) {
            this.nextPlayer();
        } else {
            console.log('jogador atual:', this.currentPlayer);
            document
                .getElementById(`${this.currentPlayer.color}-card`)
                .classList.add('valid');
            rollDiceState();
        }
    },

    useSelectedDice() {
        const dice = this.selectedDice;

        dice.face.remove();
        this.currentPlayer.resetPiecesStyle();
        return this.diceList.splice(this.diceList.indexOf(dice), 1)[0].value;
    },

    set selectedDice(dice) {
        if (!lockDiceSelect) {
            if (this.selectedDice) this.selectedDice.face.className = 'dice';

            dice.face.classList.add('selected');
            this._selectedDice = dice;
        }
        console.log('dado selecionado', this.selectedDice);

        this.avaliablePieces = this.currentPlayer.filterPieces(dice.value);
    },

    get selectedDice() {
        return this._selectedDice;
    },

    set avaliablePieces(pieces) {
        this.currentPlayer.resetPiecesStyle();
        this._avaliablePieces = pieces;
        for (let piece of pieces) {
            piece.face.classList.add('valid');
            piece.clickEvent = true;
        }
    },

    get avaliablePieces() {
        return this._avaliablePieces;
    },

    start() {
        if (this.playerList.length < 2) {
            alert(
                'São necessários pelo menos 2 jogadores para iniciar o jogo!'
            );
        } else {
            rollDiceState();
            document.getElementById('start').hidden = true;
            console.log('Jogo Iniciado');
            this.currentPlayer = this.playerList[0];
            this.currentPlayerId = 0;
            console.log('jogador atual:', this.currentPlayer);
        }
    },

    clearDices() {
        for (let dice of this.diceList) {
            dice.face.remove();
        }
        this.diceList = [];
    },

    checkWinner() {
        if (this.currentPlayer.score === 4) {
            this.currentPlayer.win = true;
        }
    },
};
