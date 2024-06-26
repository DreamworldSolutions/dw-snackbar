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
By default it auto-activates the mobile mode when the screen/window width is less than 768px. 

When Mobile mode is activated, Toast is alawys shown in the full-width of the screen (leaving some margins on the left & right).


## APIs

### `setDefaults(config)`
Used to set default values for config used for the `show`.


### `show(config)`
Used to show a snackbar. `config` is a plain-JS Object as follows:

```js
 {
   id: '', // (Optional) A Unique identifier for this Toast. Mainly used if you want to prematurely hide it.
   message: '', //Required
   type: 'INFO',  // (Optional) Possible values INFO | WARN | ERROR. Default: INFO
   timeout: 10000,  // (Optional) Time is in milliseconds after which message should be automatically dismissed. Set to `0` to prevent automatic dismiss. Default: 10000
   hideDismissBtn: true,  // (Optional) Set `true` to hide (not show) dismiss button. Default: false
   dismissIcon: '', // (Optional) Name of the Dismiss icon to be used. Default value: 'clear'
   dismissText: '', // (Optional) Dismiss button Text/Caption. It's exclusive to `dismissIcon`. So, `dismissIcon` isn't used when this is specified.
   onDismiss: callback, //(Optional), A Callback function when snackbar is dimissed, call in both cases: Either automatically closed or manually. It's first agument will be `id`.
   actionButton: { //(Optional), When actionButton spec is specified
     caption: '',  // Button Text/Caption
     callback: callBack, // callback function to be invoked when user clicks on the action button. Callback method will receive `id` in the argument. ActionButton is disabled while it’s callback execution is in progress.
     link: link // Link to be opened when user clicks on the button. Link will be opened based on `linkTarget`. Actually action button will be rendered as Link button.
     linkTarget: '' // (Optional) It used to set Target of link. Possible values '_blank', '_self', '_parent', '_top'.
   },
   loading: true, // (Optional) Set `true` to show loading indicator. Default: false. When loading is true, dismiss (icon, text) and actions buttons are hidden.
 }
```

> It can show multiple snackbars, if `show()` method is invoked again before the current snackbar isn't dismissed.


### `hide(id)`
Hides Snackbar. 
No op, if no snackbar is found with that id. This can happen when Snackbar is auto-dismissed and this method is called later.


## Properties

| Name  | Description |
| ----  | ----------- |
| positionHorizontal | Set position Horizontally. Default value: `left` (for desktop), `center` (for mobile). posible values: `left`, `center`, and `right`|
| positionVertical | Set position Vertically. Default value: `bottom`. posible values: `top`, and `bottom` |


## CSS Properties

| Name  | Description |
| ----  | ----------- |
| --dw-snackbar-text-color | Color of the snackbar text |
| --dw-snackbar-text-color-error | Color of the snackbar text when type is `error` |
| --dw-snackbar-background-color | Background color of the snackbar |
| --dw-snackbar-background-color-warn | Background color of the `warn` type snackbar |
| --dw-snackbar-background-color-error | Background color of the `error` type snackbar |
| --dw-snackbar-vertical-margin | Used to set vertical(top and bottom) margin. Default is 24px for desktop and 20px for mobile. |
| --dw-snackbar-horizontal-margin | Used to set horizontal(left and right) margin. Default is 24px for desktop and 20px for mobile |
| --dw-snackbar-min-width | Min Width for a Toast. Default value is `344px` |
| --dw-snackbar-max-width | Max Width for a Toast. Default value is `768px` |


### Road map
> Add feature to show stacked action buttons (Action button is on the 2nd row)
