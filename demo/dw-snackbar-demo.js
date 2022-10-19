/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from '@dreamworld/pwa-helpers/lit.js';
import { show } from '../dw-snackbar.js';
import '@dreamworld/dw-button';
import { ThemeStyle } from '@dreamworld/material-styles/theme.js';
class DwSnackbarDemo extends LitElement {
  static get styles() {
    return [
      ThemeStyle,
      css`
       :host{
         display: block;
         
        }
        
        dw-snackbar{
          --dw-icon-color: var(--mdc-theme-text-secondary-on-primary);
          --dw-icon-color-active: var(--mdc-theme-text-secondary-on-primary);
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
      <dw-button outlined @click="${() => this._show({ hideDismissBtn: true })}">Without dismiss icon</dw-button>
      <dw-button outlined @click="${() => this._show({ actionButton: { caption: 'Undo', callback: this._actionButtonCallback } })}">With action button</dw-button>

      <h3>Types</h3>
      <dw-button outlined @click="${() => this._show({ type: 'WARN' })}">Warn</dw-button>
      <dw-button outlined @click="${() => this._show({ type: 'ERROR' })}">Error</dw-button>

      <h3>Link</h3>
      <dw-button outlined @click="${() => this._show({actionButton: { caption: 'snackbar', link: 'https://github.com/DreamworldSolutions/dw-snackbar', linkTarget: '_blank', callback: this._actionButtonCallback } })}">Link open in new tab</dw-button>
      <dw-button outlined @click="${() => this._show({actionButton: { caption: 'snackbar', link: 'https://github.com/DreamworldSolutions/dw-snackbar', callback: this._actionButtonCallback}})}">Link open in same tab</dw-button>

    `;
  }

  _show(config) {
    show({
      message: "Snackbars provide brief messages about app processes",
      onDismiss: function () { console.log('Toast is closed') },
      timeout: 15000,
      ...config,
    });
    
  }

  _actionButtonCallback() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Action completed');
        resolve()
      }, 10000)
    });
  }
}

window.customElements.define('dw-snackbar-demo', DwSnackbarDemo);