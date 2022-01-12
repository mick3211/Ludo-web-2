import Player from './player.js';

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
