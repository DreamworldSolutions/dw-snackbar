/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css} from 'lit-element';
import { show, setPosition } from '../dw-snackbar.js';
import '@dreamworld/dw-button';

class DwSnackbarDemo extends LitElement {
  static get styles() {
    return [
      css`
       :host{
         display: block;
        }
        
        dw-snackbar{
          --mdc-theme-primary: #bb86fc;
        }

        dw-button{
          margin: 0 8px;
        }

        h3{
          margin: 24px 0 16px  0;
        }
      `
    ];
  }

  render() {
    return html`
      <dw-snackbar></dw-snackbar>

      <h3>Basic</h3>
      <dw-button outlined @click="${() => this._show()}">Basic</dw-button>
      <dw-button outlined @click="${() => this._show({hideDismissBtn: true})}">Without dismiss icon</dw-button>
      <dw-button outlined @click="${() => this._show({ actionButton: { caption: 'Undo', callback: () => { alert('Action completed')}}})}">With action button</dw-button>

      <h3>Positions</h3>
      <dw-button outlined @click="${() => { setPosition({ horizontal: 'center', vertical: 'bottom' }); this._show({}, false) }}">Center align</dw-button>
      <dw-button outlined @click="${() => { setPosition({ horizontal: 'right', vertical: 'bottom' }); this._show({}, false) }}">Right align</dw-button>
      <dw-button outlined @click="${() => { setPosition({ horizontal: 'left', vertical: 'top' }); this._show({}, false) }}">Top left align</dw-button>
      <dw-button outlined @click="${() => { setPosition({ horizontal: 'right', vertical: 'top' }); this._show({}, false) }}">Top right align</dw-button>
      <dw-button outlined @click="${() => { setPosition({horizontal: 'center', vertical: 'top'}); this._show({}, false) }}">Top center align</dw-button>

      <h3>Types</h3>
      <dw-button outlined @click="${() => this._show({type: 'WARN'})}">Warn</dw-button>
      <dw-button outlined @click="${() => this._show({type: 'ERROR'})}">Error</dw-button>
    `;
  }

  _show(config, setDefaultPosition = true) {
    if (setDefaultPosition) { 
      setPosition({ horizontal: 'left', vertical: 'bottom' });
    }

    show({
      message: "Snackbars provide brief messages about app processes",
      onDismiss: function () { console.log('Toast is closed') },
      timeout: 5000,
      ...config,
    });
    
  }

}

window.customElements.define('dw-snackbar-demo', DwSnackbarDemo);