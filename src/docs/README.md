## Usage

> *Note*: The output process for FullScreenPokemon is in flux.
> The following represents what *will* be true, but may be slightly inaccurate now.

The `fullscreenpokemon` module exposes a `FullScreenPokemon` class.
You can create a new `FSP` game object with the default constructor or by passing it a custom size.
That game object will contain a `.canvas` HTML <code>&lt;canvas&gt;</code> element which can be added to the page.

```javascript
import { FullScreenPokemon } from "fullscreenpokemon";

const FSP = new FullScreenPokemon({
    width: 700,
    height: 490
});

document.body.appendChild(FSP.canvas);
```

