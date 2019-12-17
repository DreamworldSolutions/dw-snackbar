import { LitElement, html, css } from 'lit-element';
import { displayFlex, vertical } from '@dreamworld/flex-layout/flex-layout-literals';
import { startAligned, centerAligned,  endAligned} from '@dreamworld/flex-layout/flex-layout-alignment-literals';
import { flexLayout } from '@dreamworld/flex-layout/flex-layout';
import { Typography } from '@dreamworld/material-styles/typography';
import '@dreamworld/dw-icon-button';
import '@dreamworld/dw-button';

let snackBar;

export class DwSnackbar extends LitElement { 
  static get styles() {
    return [
      Typography,
      flexLayout,
      css`
        :host {
          position: fixed;
          left: 0;
          right: 0;
          z-index: 999; 
          ${displayFlex};
          ${vertical};
          user-select: none;
          --dw-icon-color: var(--snackbar-color, rgba(255, 255, 255, 0.87));
          --dw-icon-color-active: var(--snackbar-color, rgba(255, 255, 255, 0.87));
          --mdc-theme-on-surface: var(--snackbar-color, rgba(255, 255, 255, 0.87));
        }

        :host([_horizontalAlign='left']){
          ${startAligned};
        }

        :host([_horizontalAlign='right']){
          ${endAligned};
        }

        :host([_horizontalAlign='center']){
          ${centerAligned};
        }

        :host([_verticalAlign='top']){
          top: 0;
        }

        :host([_verticalAlign='bottom']){
          bottom: 0;
        }

        .toast{
          min-width: 344px;
          margin: 8px 24px;
          box-sizing: border-box;
          color: var(--snackbar-color, rgba(255, 255, 255, 0.87));
          background-color: var(--snackbar-bg-color, #333);
          box-sizing: border-box;
          box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
          border-radius: 4px;
          min-height: 48px;
          max-width: fit-content;
        }

        .animated {
          animation-duration: 100ms;
          animation-fill-mode: both;
          -webkit-animation-duration: 100ms;
          -webkit-animation-fill-mode: both;
          animation-name: fadeInUp;
          -webkit-animation-name: fadeInUp;
          opacity: 0;
        }

        .text{
          padding: 14px 16px;
        }

        dw-icon-button,
        dw-button{
          margin-right: 8px;
        }

        a{
          text-decoration: none;
        }

        .toast[type="WARN"]{
          background-color: var(--snackbar-bg-color-warn, #FD9725);
        }

        .toast[type="ERROR"]{
          background-color: var(--mdc-theme-on-error, #b00020);
        }

        @keyframes fadeInUp {
          from {
            transform: translate3d(0,100%,0)
          }

          to {
            transform: translate3d(0,0,0);
            opacity: 1
          }
        }
      `
    ];
  }

  static get properties() {
    return {

      /**
       * Defaull toast configurations
       */
      defaultConfig: { type: Object },

      /**
       * Position of the toast at where to show taost
       * 
       * e.g. {
       *    horizontal: 'left', //Posible values: 'left', 'center', 'right'. Default: 'left'
       *    vertical: 'bottom' //Possible values: 'top', 'bottom'. Default: 'bottom'.
       *  }
       */
      position: { type: Object },

      /**
       * Map of currently opened toast with its configuration
       * e.g. { toastId: { message: 'toast' } }
       */
      _toastList: { type: Object },
      
      /**
       * Horizontal position of the toast
       * e.g. 'left', 'center', 'right'
       */
      _horizontalAlign: { type: String, reflect: true },
      
      /**
       * Vertically position of the toast
       * e.g. 'top', 'bottom'
       */
      _verticalAlign: { type: String, reflect: true}
    };
  }

  set position(position) { 
    const oldValue = this.position;

    this._position = position;

    this._horizontalAlign = position.horizontal;
    this._verticalAlign = position.vertical;

    this.requestUpdate('position', oldValue);
  }

  get position() { 
    return this._position;
  }

  render() {
    return html`

      ${Object.keys(this._toastList).map((key) => {
        return html`

          <div id="${key}" class="layout horizontal center toast animated" type="${this._toastList[key].type}">

            <!-- Toast text -->
            <span class="flex body2 text">${this._toastList[key].message}</span>

            <!-- Toast actions -->
            ${!this._toastList[key].actionButton ? '' : this._getActionButtonTemplate(this._toastList[key])}

            <!-- Dismiss button -->
            ${this._toastList[key].hideDismissBtn || this._toastList[key].actionButton ? '' : html`
            
              <dw-icon-button
               buttonSize="36"
               iconSize="18"
               icon="${this._toastList[key].dismissIcon}"
               @click="${() => { this.hide(key); }}">
              </dw-icon-button>
            `}
            
          </div>
        `
    })}
    `;
  }

  constructor() {
    super();
    this._toastList = {};
    this.defaultConfig = {
      type: 'INFO',
      timeout: 10000,
      hideDismissBtn: false,
      dismissIcon: 'close'
    };
    this.position = {
      horizontal: 'left',
      vertical: 'bottom'
    };

    snackBar = this;
  }

  _getActionButtonTemplate(config) { 
    if (config.actionButton.link) { 
      return html`
        <a href="${config.actionButton.link}">
          <dw-button .label="${config.actionButton.caption}" @click="${() => { this.hide(config.id); }}"></dw-button>
        </a>
      `
    }

    return html`<dw-button .label="${config.actionButton.caption}" @click="${() => { this._onAction(config) }}"></dw-button>`
  }

  _onAction(config) { 
    this.hide(config.id);
    config.actionButton.callback && config.actionButton.callback(config.id);
  }

  /**
   * Shows toast based on provided config.
   * @param {*} config 
   */
  show(config) {
    if (!config.id) {
      config.id = new Date().getTime();
    }

    this._toastList = this._toastList ? this._toastList : {};
    this._toastList = {
      ...this._toastList,
      [config.id]: {...this.defaultConfig, ...config}
    };

    let duration = this._toastList[config.id].timeout;

    if (duration === 0) { 
      return;
    }

    setTimeout(() => {
      this.hide(config.id);
    }, duration);
  }

  /**
   * Hides toast by it's ID.
   * @param {*} id 
   */
  hide(id) {
    if (!this._toastList[id]) {
      return;
    }

    this._toastList[id].onDismiss && this._toastList[id].onDismiss(id);
    delete this._toastList[id];
    this._toastList = { ...this._toastList };
  }
}

window.customElements.define('dw-snackbar', DwSnackbar);


function validateSnackBarExists() {
  if(!snackBar) {
    throw new Error('snackBar is not yet ready. Make sure you have added snack-bar into your app-shell');
  }

  return true;
}

export function show (config) {
  return validateSnackBarExists() && snackBar.show(config);
}

export function hide (id) {
  return validateSnackBarExists() && snackBar.hide(id);
}

export function setDefaults(config){ 
  snackBar.defaultConfig = {...snackBar.defaultConfig, ...config}
}

export function setPosition(position) { 
  return snackBar.position = position;
}