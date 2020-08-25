import { html, css } from 'lit-element';
import { LitElement } from '@dreamworld/pwa-helpers/lit-element.js';
import { layoutMixin } from '@dreamworld/pwa-helpers/layout-mixin.js';
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

/**
 * This element is extended from 'layoutMixin' which sets "mobile" property initially.
 * There are 3 types of toast generally: "Informative", "Warning" "Error"
 * 
 * Behavior: 
 *  - In mobile it's bottom/center aligned while in desktop it's bottom/left aligned.
 *  - Default type is "INFO". Use can provide "WARN" & "ERROR"
 *  - If actionButton is provided in config, it will renders action button at right side.
 *  - Renders close button at right side by default. User can hide it as well by "hideDismissBtn" config property.
 * 
 * 
 * CSS varialbes
 *  --dw-toast-min-width (It's applied to desktop only. In mobile there is no minimum width.)
 *  --dw-toast-max-width (Used to set maximum width of toast. default is 768px)
 *  --dw-toast-margin (Used to set around margin in desktop. Default is 24px)
 *  --dw-toast-mobile-margin (Used to set around margin in mobile. Default is 20px)
 *  --dw-toast-color
 *  --dw-toast-bg-color
 *  --dw-toast-bg-color-warn
 * 
 * USAGE PATTERN: 
 *   <dw-snackbar></dw-snackbar>
 *   import {show as showSnackBar} from '@dreamworld/dw-snackbar/dw-snackbar.js';
 * 
 *    showSnackBar({ message: ${message}), actionButton: {caption: ${buttonCaption}, callback} });
 */

let snackBar;

export class DwSnackbar extends layoutMixin(LitElement) { 

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
          max-width: var(--dw-toast-max-width, 768px);
          margin: var(--dw-toast-margin, 24px);
          box-sizing: border-box;
          color: var(--dw-toast-color, var(--mdc-theme-text-primary-on-dark));
          background-color: var(--dw-toast-bg-color, #333);
          box-sizing: border-box;
          box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
          border-radius: 4px;
          min-height: 48px;
        }

        :host([mobile]) .toast{
          margin: var(--dw-toast-mobile-margin, 20px);
          min-width: 0;
          width: calc(100vw - (var(--dw-toast-mobile-margin, 20px) * 2));
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
      _verticalAlign: { type: String, reflect: true }
    };
  }

  get mobile(){
    return this._mobile;
  }
  
  set mobile(value) {
    let oldValue = this._mobile;
    if(value === oldValue) {
      return;
    }
    this._mobile = value;
    if (this._mobile) {
      this.position = { horizontal: 'center', vertical: 'bottom' };
    } else {
      this.position = { horizontal: 'left', vertical: 'bottom' };
    }
    this.requestUpdate('mobile', oldValue);
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
            ${toast.hideDismissBtn ? '' : html`
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
   * Returns timeout for the given toastId. It can be overridden to customize the behavior. 
   * e.g. To return the duration based on application requirement like N seconds for the Toasts without action buttons and M seconds for the Toasts with Action Buttons.
   * @param {*} toastId 
   * @returns toast timeout of given toastId from toast list data.
   * @protected
   */
  _getToastTimeout(toastId) {
    return this._toastList[toastId].timeout;
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

    let timeout = this._getToastTimeout(config.id);

    if (timeout === 0 || this._toastList[config.id].type === 'ERROR') { 
      return;
    }

    setTimeout(() => {
      this.hide(config.id);
    }, timeout);
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