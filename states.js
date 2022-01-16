import { game } from './index.js';

export var lockDiceRoll = true;
export var lockDiceSelect = true;

export function waitState() {
    lockDiceRoll = true;
    lockDiceSelect = true;
}

export function rollDiceState() {
    lockDiceRoll = false;
    lockDiceSelect = true;
}

export function movePieceState() {
    lockDiceRoll = true;
    lockDiceSelect = false;
    startPlay();
}

function startPlay() {
    console.log('Started', 'dados', game.diceList);
    if (game.diceList.length > 0) {
        game.selectedDice = game.diceList[0];
        if (game.avaliablePieces.length === 0) {
            game.useSelectedDice();
            startPlay();
        } else if (game.avaliablePieces.length === 1) {
            game.avaliablePieces[0].move(game.useSelectedDice());
            startPlay();
        }
    } else {
        console.log('Finished');
        game.nextPlayer();
    }
}
