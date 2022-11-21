import { LitElement, html, css } from "lit";

class DialogDetails extends LitElement {
  constructor() {
    super();
    this.title = "Home";

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
      position: fixed;
      margin: 10vh auto;
      margin-right: auto;
      margin-left: auto;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      max-height: 80vh;
      max-width: 90vw;
      width: 448px;
      overflow: auto;
      box-shadow: 0 0 18px rgba(0, 0, 0, 0.4);
      background-color: white;
    }
  `;

  render() {
    return html`
      <div class="wrapper">
        Content
        <div><slot></slot></div>
      </div>
    `;
  }
}

customElements.define("wb-dialog-details", DialogDetails);
