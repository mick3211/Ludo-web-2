import Player from './player.js';
import Dice from './dice.js';
import { lockDiceRoll, movePieceState } from './states.js';
import { game } from './index.js';

const cards = document.getElementsByClassName('player-card');
for (let card of cards) {
    const form = card.querySelector('form');
    const name = form.elements['player-name'].value;
    const color = card.attributes['meta-color'].value;

    card.addEventListener('click', function () {
        card.classList.add('no-before');
        form.hidden = false;
    });

    form.querySelector('button').addEventListener('click', function () {
        this.hidden = true;
        new Player(name, color);
    });
}

//Lógica de rolar dados
const mainContainer = document.getElementById('main-container');
var diceCount = 0;
mainContainer.addEventListener('click', function (ev) {
    if (ev.target === this && !lockDiceRoll) {
        const dice = new Dice(6);
        dice.draw(ev.target, ev.layerX, ev.layerY);
        game.diceList.push(dice);

        if (++diceCount === 3 && dice.value === 6) {
            game.clearDices();
            diceCount = 0;
            movePieceState();
        } else if (dice.value !== 6) {
            movePieceState();
            diceCount = 0;
        }
    }
});

document.getElementById('start').addEventListener('click', () => game.start());
