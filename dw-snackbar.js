import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import sortBy from 'lodash-es/sortBy';

// Styles
import { displayFlex, vertical, horizontal } from '@dreamworld/flex-layout/flex-layout-literals';
import { centerAligned } from '@dreamworld/flex-layout/flex-layout-alignment-literals';
import { flexLayout } from '@dreamworld/flex-layout/flex-layout';
import { Typography } from '@dreamworld/material-styles/typography';

// Custom elements
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
          z-index: 999; 
          ${displayFlex};
          ${vertical};
          user-select: none;
          --dw-icon-color: var(--dw-toast-color, var(--dw-icon-color-active-on-dark));
          --dw-icon-color-active: var(--dw-toast-color, var(--dw-icon-color-active-on-dark));
          --mdc-theme-on-surface: var(--dw-toast-color, var(--mdc-theme-text-primary-on-dark));
        }

        :host([_horizontalAlign='left']){
          left: 0;
        }

        :host([_horizontalAlign='right']){
          right: 0;
        }

        :host([_horizontalAlign='center']){
          transform: translateX(-50%);
          left: 50%;
        }

        :host([_verticalAlign='top']){
          top: 0;
        }

        :host([_verticalAlign='bottom']){
          bottom: 0;
        }

        .toast{
          ${displayFlex};
          ${horizontal};
          ${centerAligned};
          min-width: var(--dw-toast-min-width, 344px);
          max-width: var(--dw-toast-max-width);
          margin: var(--dw-toast-margin, 24px);
          box-sizing: border-box;
          color: var(--dw-toast-color, var(--mdc-theme-text-primary-on-dark));
          background-color: var(--dw-toast-bg-color, #333);
          box-sizing: border-box;
          box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
          border-radius: 4px;
          min-height: 48px;
        }

        .toast[type="WARN"]{
          background-color: var(--dw-toast-bg-color-warn, #FD9725);
        }

        .toast[type="ERROR"]{
          background-color: var(--mdc-theme-error, #b00020);
        }

        /* Flex items' margins won't collapse so removing top margin */
        .toast + .toast{
          margin-top: 0;
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
    this._position = position;

    this._horizontalAlign = position.horizontal;
    this._verticalAlign = position.vertical;
  }

  get position() { 
    return this._position;
  }

  render() {
    return html`
      ${repeat(sortBy(this._toastList, 'counter'), (toast) => toast.id, (toast) => html`
          <div class="toast animated" type="${toast.type}">

            <!-- Toast text -->
            <div class="flex body2 text">${toast.message}</div>

            <!-- Toast actions -->
            ${!toast.actionButton ? '' : this._getActionButtonTemplate(toast)}

            <!-- Dismiss button -->
            ${toast.hideDismissBtn || toast.actionButton ? '' : html`
            
              <dw-icon-button
               buttonSize="36"
               iconSize="18"
               .icon="${toast.dismissIcon}"
               @click="${() => { this.hide(toast.id); }}">
              </dw-icon-button>
            `}
            
          </div>
        `)}
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
    /**
     * Sequential number assigned to each each Toast. Represents, the number lastly assigned. So, initial value is 0.
     * For the first toast, number will be assigned 1.
     * 
     * Toast.counter is used to define sort-order. We want to preserve the order of the toasts, same as the submitted
     * by the user. So, the Toast submitted first will be shown on the top in the sequence.
    */
    this.constructor.counter = 0;
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
      [config.id]: {...this.defaultConfig, ...config, counter: ++this.constructor.counter}
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

    let toastDetail = this._toastList[id];

    delete this._toastList[id];
    this._toastList = { ...this._toastList };
    toastDetail.onDismiss && toastDetail.onDismiss(id);
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