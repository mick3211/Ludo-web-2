import { game } from './index.js';
import { GreenPiece, YellowPiece, RedPiece, BluePiece } from './piece.js';

class Player {
    constructor(name, color) {
        if (game.playerList.length >= 4) {
            throw new Error('Número máximo de jogadores atingido');
        }

        let pieceClass;

        switch (color) {
            case 'green':
                pieceClass = GreenPiece;
                break;
            case 'blue':
                pieceClass = BluePiece;
                break;
            case 'red':
                pieceClass = RedPiece;
                break;
            case 'yellow':
                pieceClass = YellowPiece;
                break;
            default:
                throw new Error('Cor inválida');
        }

        this.name = name;
        this.color = color;
        this.score = 0;
        this.win = false;
        this.pieces = [
            new pieceClass(`${color}-lock-0`, this),
            new pieceClass(`${color}-lock-1`, this),
            new pieceClass(`${color}-lock-2`, this),
            new pieceClass(`${color}-lock-3`, this),
        ];

        game.addPlayer(this);
    }

    resetPiecesStyle() {
        for (let piece of this.pieces) {
            piece.face.classList.remove('valid');
            piece.clickEvent = false;
        }
    }

    filterPieces(value) {
        const validPieces = [];

        this.resetPiecesStyle();

        this.pieces.forEach(piece => {
            if (
                (!piece.locked && piece.steps + value < 57) ||
                (piece.locked && value === 6)
            ) {
                validPieces.push(piece);
            }
        });
        return validPieces;
    }
}
export default Player;
