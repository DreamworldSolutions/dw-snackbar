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


### Mobile Mode
By default it auto-activates the mobile mode when the screen/window width is less than 768px. Though, you can use `mobile` (boolean) property to control this yourself.

When Mobile mode is activated, Toast is alawys shown in the full-width of the screen (leaving some margins on the left & right).


## APIs

### setDefaults(config)
Used to set default values for config used for the `show`.


### `show(config)`
Used to show a snackbar. `config` is a plain-JS Object as follows:

```js
 {
   id: '', // (Optional) A Unique identifier for this Toast. Mainly used if you want to prematurely hide it.
   message: '', //Required
   type: 'INFO',  // (Optional) Possible values INFO | WARN | ERROR. Default: INFO
   timeout: 10000,  // (Optional) Time is in milliseconds after which message should be automatically dismissed. Set to `0` to prevent automatic dismiss. Default: 10000
   textColor: 'red', // (Optional) Provides the way using which you can update the color of the text in toast. Default: var(--mdc-theme-text-primary-on-dark).
   hideDismissBtn: true,  // (Optional) Set `true` to hide (not show) dismiss button. Default: false
   dismissIcon: '', // (Optional) Name of the Dismiss icon to be used. Default value: 'clear'
   onDismiss: callback, //(Optional), A Callback function when snackbar is dimissed, call in both cases: Either automatically closed or manually. It's first agument will be `id`.
   actionButton: { //(Optional), When actionButton spec is specified
     caption: '',  // Button Text/Caption
     callback: callBack, // callback function to be invoked when user clicks on the action button. Callback method will receive `id` in the argument.
     link: link // Link to be opened when user clicks on the button. Link will be opened in the current window. Actually action button will be rendered as Link button. It's exclusive to `callback`. So, `callback` isn't invoked when this is specified.
     stacked: false, //Optional. Set to `true` when action button is to be shown on the Next Line. Default=false. 
   }
 }
```

> It can show multiple snackbars, if `show()` method is invoked again before the current snackbar isn't dismissed.


### `setPosition(position)`
Mostly, In Desktop mode, you would like to anchor Snackbar to the left, while on Mobile you would like to anchor to the center. So, whenever your app change the layout, call this method to update Layout of this.

```js
{
  horizontal: 'left', //Posible values: 'left', 'center', 'right'. Default: 'left'
  vertical: 'bottom' //Possible values: 'top', 'bottom'. Default: 'bottom'.
}
```

### `hide(id)`
Hides Snackbar. 
No op, if no snackbar is found with that id. This can happen when Snackbar is auto-dismissed and this method is called later.


## CSS Properties

| Name  | Description |
| ----  | ----------- |
| `--dw-toast-color` | Color of the snackbar text and icon |
| `--dw-toast-bg-color` | Background color of the snackbar |
| `--dw-toast-bg-color-warn` | Background color of the warn type snackbar |
| `--mdc-theme-error` | Background color of the error type snackbar |
| `--dw-toast-margin` | `margin` for a toast. Default value: `24px`. You can set different values for the top/bottom & left/right margins too. e.g. `24px 210px`. So, the toast will be shown 210px away from the left edge of the screen (after the drawer) and 24px away from the bottom edge of the screen. **This doesn't work for the Mobile Layout.** |
| `--dw-toast-mobile-margin` | Left & Right margin for the Toast on the Mobile. On the Mobile a Toast is always shown in the full width, so you just need to modify the value of the left & right margins. Default value: `20px`. |
| `--dw-toast-min-width` | Min Width for a Toast. Default value `344px` |
| `--dw-toast-max-width` | Max Width. Default no value. So, limited by the screen size |


### Road map
> Add feature to show stacked action buttons (Action button is on the 2nd row)
