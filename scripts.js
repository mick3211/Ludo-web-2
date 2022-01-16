import Player from './player.js';
import Dice from './dice.js';
import { lockDiceRoll, movePieceState, rollDiceState } from './states.js';
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
    }
});

window.addEventListener('diceAnimation', function (ev) {
    if (++diceCount === 3 && ev.detail.n === 6) {
        game.clearDices();
        diceCount = 0;
        movePieceState();
    } else if (ev.detail.n !== 6) {
        movePieceState();
        diceCount = 0;
    } else rollDiceState();
    console.log('acabou a animação', ev.detail.n);
});

document.getElementById('start').addEventListener('click', () => game.start());
