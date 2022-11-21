import { LitElement, html, css } from "lit";

class Counter extends LitElement {
  constructor() {
    super();
    this.title = 'Home';

    this.counter = 0;
  }

  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
    };
  }

  increase() {
    this.counter -= 1;
  }

  decrease() {
    this.counter += 1;
  }

  static styles = css`
    .wrapper {
      display: grid;
      grid-template-rows: 44px 1fr;
      border: 1px solid #b2bec3;
      border-radius: 6px;
      justify-content: center;
      align-items: center;
    }
  `;

  render() {
    return html`
      <section class="wrapper">
        <h1>${this.title}</h1>
        <span>${this.counter}</span>
        <div>
          <button @click="${this.decrease}">+</button>
          <button @click="${this.increase}">-</button>
        </div>
      </section>
    `;
  }
}

customElements.define("wb-counter", Counter);