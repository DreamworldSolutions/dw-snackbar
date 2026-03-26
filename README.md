# @dreamworld/dw-snackbar

A Material Design snackbar/toast WebComponent built with LitElement. Supports multiple simultaneous toasts, four severity types (INFO, WARN, ERROR, SUCCESS), action buttons, loading state, and automatic mobile-responsive layout.

---

## 1. User Guide

### Installation & Setup

```bash
yarn add @dreamworld/dw-snackbar
```

Register the custom element and place `<dw-snackbar>` once in your app shell. The module exports both the class and the module-level imperative functions.

```html
<!-- index.html — load Material Design fonts required by the component -->
<link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet" />
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
```

```js
// app-shell.js — register the element
import '@dreamworld/dw-snackbar/dw-snackbar.js';
```

```html
<!-- app-shell template -->
<dw-snackbar></dw-snackbar>
```

> **Important:** `show()`, `hide()`, and `setDefaults()` will throw if called before `<dw-snackbar>` is connected to the DOM.

---

### Basic Usage

```js
import { show, hide, setDefaults } from '@dreamworld/dw-snackbar/dw-snackbar.js';

// Show a simple informational toast
show({ message: 'Changes saved successfully.' });

// Show a toast with an action button
show({
  message: 'Item deleted.',
  actionButton: {
    caption: 'Undo',
    callback: async (id) => {
      await undoDelete();
    },
  },
});

// Hide a specific toast programmatically
const toastId = Date.now();
show({ id: toastId, message: 'Processing…', loading: true, timeout: 0 });
// later…
hide(toastId);
```

---

### API Reference

#### Exported Functions

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `show(config)` | `config: Object` | `void` | Displays a toast. Throws if `<dw-snackbar>` is not in the DOM. |
| `hide(id)` | `id: string \| number` | `void` | Removes a toast by its ID. No-op if the ID does not exist. |
| `setDefaults(config)` | `config: Object` | `void` | Merges `config` into the global `defaultConfig`, affecting all subsequent `show()` calls. |

---

#### `show(config)` — Config Object

| Property | Type | Default | Required | Description |
|---|---|---|---|---|
| `message` | `string` | — | Yes | The text content of the toast. Rendered as HTML via Lit's `html` template literal. |
| `id` | `string \| number` | `Date.now()` | No | Unique identifier. Auto-generated from timestamp if omitted. Use a custom ID to later call `hide(id)`. |
| `type` | `'INFO' \| 'WARN' \| 'ERROR' \| 'SUCCESS'` | `'INFO'` | No | Controls the background color of the toast. |
| `timeout` | `number` | `10000` | No | Milliseconds before the toast auto-dismisses. Set to `0` to prevent auto-dismiss. **ERROR type toasts never auto-dismiss regardless of this value.** |
| `hideDismissBtn` | `boolean` | `false` | No | When `true`, the dismiss button (icon or text) is hidden. |
| `dismissIcon` | `string` | `'close'` | No | Material Icon name for the dismiss button. Ignored when `dismissText` is set. |
| `dismissText` | `string` | `undefined` | No | Text label for the dismiss button. When set, renders a `<dw-button>` instead of `<dw-icon-button>`. Mutually exclusive with `dismissIcon`. |
| `dismissCallback` | `function` | `undefined` | No | Called synchronously when the user clicks the dismiss button, before the toast is removed. |
| `onDismiss` | `function(id)` | `undefined` | No | Called after the toast is removed from the DOM, whether dismissed manually or automatically. Receives the toast `id` as its first argument. |
| `loading` | `boolean` | `false` | No | When `true`, shows an indeterminate `<mwc-circular-progress>` spinner and hides both the action button and dismiss button. |
| `actionButton` | `Object` | `undefined` | No | Configuration for an action button rendered on the right side of the toast. See sub-table below. |

#### `actionButton` Sub-properties

| Property | Type | Required | Description |
|---|---|---|---|
| `caption` | `string` | Yes | Button label text. |
| `callback` | `async function(id)` | No | Called when the user clicks the action button. Receives the toast `id`. The button is disabled for the duration of the async callback and re-enabled when it resolves. |
| `link` | `string` | No | URL to navigate to. When set, the button is wrapped in an `<a>` tag. |
| `linkTarget` | `'_blank' \| '_self' \| '_parent' \| '_top'` | No | HTML `target` attribute for the link. Only applies when `link` is set. |

---

#### `<dw-snackbar>` Element Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `position-horizontal` | `'left' \| 'center' \| 'right'` | `'left'` (desktop) / `'center'` (mobile) | Horizontal anchor of the toast stack. Automatically set to `'center'` on mobile. |
| `position-vertical` | `'top' \| 'bottom'` | `'bottom'` | Vertical anchor of the toast stack. |

> `mobile` is a reflected boolean property managed internally by the component. Do not set it manually.

---

#### CSS Custom Properties

| Property | Default (desktop) | Default (mobile) | Description |
|---|---|---|---|
| `--dw-snackbar-min-width` | `344px` | _(not applied)_ | Minimum width of a toast. Not applied on mobile; width is viewport-relative. |
| `--dw-snackbar-max-width` | `768px` | `768px` | Maximum width of a toast. |
| `--dw-snackbar-vertical-margin` | `24px` | `20px` | Top and bottom margin around each toast. |
| `--dw-snackbar-horizontal-margin` | `24px` | `20px` | Left and right margin. On mobile, also determines the visible width: `calc(100vw - margin * 2)`. |
| `--dw-snackbar-text-color` | `var(--dw-on-surface-invert-color)` | same | Text color for INFO and WARN toasts. |
| `--dw-snackbar-text-color-error` | `var(--dw-on-surface-invert-color)` | same | Text color for ERROR toasts. |
| `--dw-snackbar-background-color` | `var(--mdc-theme-on-surface)` | same | Background for INFO toasts. |
| `--dw-snackbar-background-color-warn` | `#fd9725` | same | Background for WARN toasts. |
| `--dw-snackbar-background-color-error` | `var(--mdc-theme-error)` | same | Background for ERROR toasts. |
| `--dw-snackbar-background-color-success` | `#259B24` | same | Background for SUCCESS toasts. |

---

### Configuration Options

`setDefaults(config)` merges into the component's `defaultConfig`. The built-in defaults are:

```js
{
  type: 'INFO',
  timeout: 10000,
  hideDismissBtn: false,
  dismissIcon: 'close',
  actionButtondisabled: false,
}
```

**Example — change the default timeout for all toasts:**

```js
import { setDefaults } from '@dreamworld/dw-snackbar/dw-snackbar.js';

setDefaults({ timeout: 5000 });
```

---

### Advanced Usage

#### Loading State

Use `loading: true` with `timeout: 0` to show an indefinite progress indicator. Hide it manually when the async operation completes.

```js
const id = 'upload-progress';
show({ id, message: 'Uploading file…', loading: true, timeout: 0, hideDismissBtn: true });

await uploadFile(file);

hide(id);
```

#### Async Action Button

The action button is automatically disabled while its `callback` is executing and re-enabled when the returned Promise resolves.

```js
show({
  message: 'Message sent.',
  actionButton: {
    caption: 'Undo',
    callback: async (id) => {
      await undoSend(id);
      hide(id);
    },
  },
});
```

#### Link Action Button

```js
// Opens in a new tab
show({
  message: 'View on GitHub.',
  actionButton: {
    caption: 'Open',
    link: 'https://github.com/DreamworldSolutions/dw-snackbar',
    linkTarget: '_blank',
  },
});

// Opens in the same tab (omit linkTarget)
show({
  message: 'View details.',
  actionButton: {
    caption: 'View',
    link: '/details',
  },
});
```

#### ERROR Type — No Auto-Dismiss

ERROR toasts are never auto-dismissed, regardless of the `timeout` value. They must be dismissed by the user or by calling `hide(id)` programmatically.

```js
show({
  type: 'ERROR',
  message: 'Connection failed. Please retry.',
  timeout: 5000, // ignored for ERROR type
});
```

#### Multiple Stacked Toasts

Calling `show()` multiple times before dismissal renders toasts stacked vertically. Toasts are ordered by submission sequence (first submitted appears on top).

```js
show({ id: 'a', message: 'First notification', timeout: 0 });
show({ id: 'b', message: 'Second notification', timeout: 0 });
show({ id: 'c', message: 'Third notification', timeout: 0 });
```

---

## 2. Developer Guide / Architecture

### Architecture Overview

| Pattern | Implementation |
|---|---|
| **Singleton** | A single `snackBar` variable is set in the `DwSnackbar` constructor. Module-level `show()`, `hide()`, `setDefaults()` delegate to this instance. Calling these functions before the element is instantiated throws a descriptive error. |
| **Mixin (Responsive Layout)** | `DwSnackbar extends layoutMixin(LitElement)`. The `layoutMixin` sets an initial `mobile` value. A debounced resize listener (200 ms) updates `mobile` when `window.innerWidth` crosses the 768 px breakpoint, which automatically switches `positionHorizontal` between `'left'` and `'center'`. |
| **FIFO Toast Ordering** | Each toast is assigned a monotonically increasing `counter` from `DwSnackbar.counter`. The `render()` method uses `sortBy(this._toastList, 'counter')` to produce a stable, submission-order list. |
| **Immutable State Updates** | `_toastList` and `_disabledButtons` are always replaced with spread copies (`{ ...old, [id]: value }`) to trigger Lit reactivity. |
| **Callback Isolation** | `_onAction(config)` sets `_disabledButtons[id] = true`, awaits `config.actionButton.callback(id)`, then deletes the key. This prevents double-submission without any external state. |
| **Protected Override Point** | `_getToastTimeout(toastId)` is documented as `@protected`. Subclasses can override it to vary timeout per toast (e.g., shorter for action-less toasts). |

### Module Responsibilities

| Unit | Responsibility |
|---|---|
| `DwSnackbar` class | Renders toast stack, manages `_toastList`, handles responsive layout, exposes `show()` / `hide()` instance methods. |
| Module-level `show` / `hide` / `setDefaults` | Public imperative API. Validates that `snackBar` is initialized before delegating. |
| `layoutMixin` (from `@dreamworld/pwa-helpers`) | Provides initial `mobile` property and the resize-based detection logic. |
| `repeat` directive (from `lit`) | Efficient DOM keying for toast list — keyed by `toast.id` to preserve element identity across re-renders. |

### Key Behavioral Notes

- `message` is rendered via Lit's `html` template literal, so it supports HTML markup.
- When both `dismissText` and `dismissIcon` are supplied, `dismissText` takes precedence (the icon is ignored).
- `dismissCallback` fires before the toast is removed; `onDismiss` fires after.
- The `SUCCESS` CSS custom property (`--dw-snackbar-background-color-success`) is defined in the source but is not listed in the JSDoc comment block — it is confirmed in the CSS at line 120–122 of `dw-snackbar.js`.

### Development

```bash
yarn start
# Launches @web/dev-server with demo at /demo/index.html, auto-opens browser, watches for changes.
```

> No automated test suite is configured (`"test"` script exits with code 1).
