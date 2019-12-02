# dw-snackbar
A Material design snackbar WebComponent implemented through LitElement

## Usage
1. Add Snackbar to your App Shell. 
```js
import '@dreamworld/dw-snackbar';
```
In app-shell render template add element

```html
<dw-snackbar></dw-snackbar>
```

2. To show snackbar, call `show` or `hide` method in `@dreamworld/dw-snackbar` module.


## APIs

### setDefaults(config)
Used to set default configs. e.g. In Desktop mode, you would like to anchor Snackbar to the left, while on Mobile you would like to anchor to the center.


### `show(config)`
Used to show a snackbar. `config` is a plain-JS Object as follows:

```js
 {
   id: '', //A Unique identifier for this Toast. Mainly used if you want to prematurely hide it.
   type: 'INFO',  // Possible values INFO | WARN | ERROR
   timeout: 10000,  // Time is in milliseconds after which message should be automatically dismissed. Set to `0` to prevent automatic dismiss.
   hideDismissBtn: true,  // Set `true` to hide (not show) dismiss button.
   dismissIcon: '', //Name of the Dismiss icon to be used. Default value: //TODO
   onDismiss: callback, //(Optional), A Callback function when snackbar is dimissed, call in both cases: Either automatically closed or manually. It's first agument will be `id`.
   anchor: { //Anchor position. Optional. Default value: {horizontal: left, vertical: bottom}
      horizontal: 'left', //Posible values: 'left', 'center', 'right'
      vertical: 'bottom' //Possible values: 'top', 'bottom'
   },
   actionButton: { //When actionButton spec is specified, dismiss icon-button isn't shown.
     caption: '',  // Button Text/Caption
     callback: callBack, // callback function to be invoked when user clicks on the action button. Callback method will receive `id` in the argument.
     link: link // Link to be opened when user clicks on the button. Link will be opened in the current window. Actually action button will be rendered as Link button. It's exclusive to `callback`. So, `callback` isn't invoked when this is specified.
     stacked: false, //Optional. Set to `true` when action button is to be shown on the Next Line. Default=false. 
   },
   
 }
```

> It can show multiple snackbars, if `show()` method is invoked again before the current snackbar isn't dismissed.

### `hide(id)`
Hides Snackbar. 
No op, if no snackbar is found with that id. This can happen when Snackbar is auto-dismissed and this method is called later.


## CSS Properties
//TODO
