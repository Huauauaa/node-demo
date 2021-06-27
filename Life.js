// const dayjs = require('dayjs');

class Life {
  #birth = '';
  #total = 90;
  #width = 10;
  #height = 10;

  constructor(birth) {
    this.#birth = birth;
  }

  get age() {
    return Math.trunc(
      (new Date() - new Date(this.#birth)) / 1e3 / 60 / 60 / 24 / 365,
    );
  }

  genRect({
    x,
    y,
    width = this.#width,
    height = this.#height,
    radius = 1,
    fillColor = 'transparent',
  }) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fillColor}" />`;
  }

  get svg() {
    const start = `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" stroke="lightblue" fill="transparent">`;
    let content = ``;

    let index = 0;

    while (index < this.#total) {
      content += this.genRect({
        x: (index % 10) * this.#width,
        y: Number.parseInt(index / 10) * this.#height,
        fillColor: index < this.age ? 'gray' : undefined,
      });
      index += 1;
    }

    const end = `<text x="0" y="110" fill="black" stroke="black">Remaining Life</text></svg>`;

    return `${start}${content}${end}`;
  }
}

module.exports = Life;
