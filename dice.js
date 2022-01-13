//import { game } from './index';

class Dice {
    constructor(sides) {
        this.sides = sides;
        this.face = document.createElement('div');
        this.face.className = 'dice';

        /*this.face.addEventListener('click', () => {
            if (!game.lockDiceSelect) {
                game.selectedDice = this;
            }
        });*/

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
        this.face.innerText = this._value;
    }

    get value() {
        return this._value;
    }
}

export default Dice;
