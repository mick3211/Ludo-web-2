import { lockDiceSelect, waitState } from './states.js';
import { game } from './index.js';

const animation = 'rotate-hor-center';

class Dice {
    constructor(sides) {
        this.sides = sides;
        this.face = document.createElement('div');
        this.face.className = 'dice ' + animation;

        this.face.addEventListener('click', () => {
            if (!lockDiceSelect) {
                game.selectedDice = this;
            }
        });

        this.face.addEventListener('animationstart', () => {
            waitState();
        });

        this.face.addEventListener('animationend', () => {
            this.face.innerText = this.value;
            let ev = new CustomEvent('diceAnimation', {
                detail: {
                    n: this.value,
                },
            });

            setTimeout(() => {
                window.dispatchEvent(ev);
            }, 500);
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
        //this.face.innerText = this._value;
    }

    get value() {
        return this._value;
    }
}

export default Dice;
