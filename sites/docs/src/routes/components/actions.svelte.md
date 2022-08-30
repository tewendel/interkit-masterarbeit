# Actions

`actions` are snippets of code that connect components and states

## Wording

- `trigger`: the cause of an action, represented as a string (for example: `openMenu`). Triggers are sent by components, often caused by user interaction. Triggers can also be sent by actions or other code.
- `method`: a function that is executed when a matching trigger is received. It can contain arbitrary code, but usually it sets a `uiKey` or populates a `globalStore`
- `action` : a combination of multiple triggers and one method.
- `actions.js`: This file container all actions of the project

## Example

This actions file contains one action. It listens to the trigger "openMenu" and sets the uiKey "menuOpen" to true.

```js
// actions.js
import { registerActions, InterkitClient } from 'interkit'

export default () => registerActions([
  {
    triggers: ["openMenu"],
    method: function (arg) {
      InterkitClient.setUiKey("menuOpen", true)
    }
  }
])
```

In this example, pressing the button triggers the action that sets uiKey "menuOpen" to true which causes the conditional to react and show the overlay

![example blockly](/images/actions_example.png)