## Usage

The `fullscreenpokemon` module exposes a `FullScreenPokemon` class.
You can create a new game object by passing it `width` and `height` for a screen size.
That game object will contain a `.container` HTML element which can be added to the page.

```javascript
import { FullScreenPokemon } from "fullscreenpokemon";

const fsp = new FullScreenPokemon({
    width: 700,
    height: 490
});

document.body.appendChild(fsp.container);
```
