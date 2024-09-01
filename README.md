# Bliss Radio

## About 

`@prozilla-os/bliss-radio` is a Radio app based on https://blissradio.eu/.

## Installation

`@prozilla-os/core` is required to run this application.

```sh
$ npm install @prozilla-os/core @prozilla-os/bliss-radio
$ yarn add @prozilla-os/core @prozilla-os/bliss-radio
$ pnpm add @prozilla-os/core @prozilla-os/bliss-radio
```

## Usage

### Basic setup

```tsx
import { Desktop, ModalsView, ProzillaOS, Taskbar, WindowsView, AppsConfig } from "@prozilla-os/core";
import { blissRadio } from "@prozilla-os/bliss-radio";

function App() {
  return (
    <ProzillaOS
      systemName="Example"
      tagLine="Powered by ProzillaOS"
      config={{
        apps: new AppsConfig({
          apps: [ blissRadio ]
        })
      }}
    >
      <Taskbar/>
      <WindowsView/>
      <ModalsView/>
      <Desktop/>
    </ProzillaOS>
  );
}
```

## Links

- [GitHub][github]
- [npm][npm]
- [Discord][discord]
- [Ko-fi][ko-fi]

[github]: https://github.com/prozilla-os/ProzillaOS/tree/main/packages/apps/calculator
[npm]: https://www.npmjs.com/package/@prozilla-os/bliss-radio
[discord]: https://discord.gg/JwbyQP4tdz
[ko-fi]: https://ko-fi.com/prozilla