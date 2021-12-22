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
