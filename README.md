# `🐃 @yak-spirit/yak-swap-ui`

A reusable React component for swapping with Yield Yak Router. The YY Router can be
found [here](https://github.com/yieldyak/yak-aggregator).

## Usage

#### Install

First install the required peer dependencies into your React project.

```
yarn add web3 bignumber.js react-use react-countdown-circle-timer valtio react-number-format @headlessui/react classnames react-windowed-select react-moralis moralis daisyui
```

Wrap your app in MoralisProvider, provide appId & serverId (server should support Avalanche Mainnet)
You can find instructions here: https://github.com/MoralisWeb3/react-moralis

Install tailwind (use as guidance https://tailwindcss.com/docs/guides/create-react-app)

```
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure tailwind.config.js
Add tailwind directives to your CSS and import .css file

! if you have webpack >= 5 or cra >= 5, you should import some ...

Then install the package.

```
yarn add @dragoonzx/yak-swap-ui
```

#### Add the Swap Component

To embed the `YakSwap` component into your application,
you should do all prerequisite installation
and then you can just use component
For example,

```javascript
import YakSwap from '@yak-spirit/yak-swap-ui';

<YakSwap />;
```

All of the complexity of communicating with the YY Router and managing
its data is handled internally by the component.

#### Referral Fees

To earn referral fees ...

## Developing

#### Install dependencies

```
yarn
```

#### Build

```
yarn build
```

## Run the example app

```
yarn dev
```
