# overeno-zakazniky

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

[Heureka Ověřeno zákazníky](http://overeno.heureka.cz/) (ShopCertification) service API client implementation for Node.js/TypeScript.

## Installation

```bash
# npm
npm install overeno-zakazniky

# yarn
yarn add overeno-zakazniky

# pnpm
pnpm add overeno-zakazniky
```

## Usage

Initialize the `ShopCertification` class using [your API key](http://sluzby.heureka.cz/sluzby/certifikat-spokojenosti/) (you need to log in):

```typescript
import { ShopCertification } from 'overeno-zakazniky'

const shopCertification = new ShopCertification({
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
})
```

**Important Security Note**: Your API key should be kept secret. Never expose it in client-side JavaScript or share it publicly. It should only be used in server-side code. If you need to implement something different, please consult our [support department](http://onas.heureka.cz/kontakty).

### For Slovak Shops

Slovak shops should initialize the class with the 'SK' service parameter:

```typescript
const shopCertification = new ShopCertification({
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  service: 'SK'
})
```

### Logging Orders

You can log orders with various levels of detail:

#### Minimal Example (Required Fields Only)

```typescript
await shopCertification.logOrder({
  email: 'customer@example.com'
})
```

#### Complete Example (All Fields)

```typescript
await shopCertification.logOrder({
  email: 'customer@example.com',
  orderId: '15195618851564',
  productIds: ['B1234', '15968421', '814687']
})
```

### API Response

The `logOrder` method returns a Promise that resolves to an API response object:

```typescript
interface ApiResponse {
  code: number
  message: string
}
```

### Error Handling

The module implements several validations:
- Email is required
- Order ID length must not exceed 255 characters
- Duplicate order submissions are prevented
- API communication errors are properly handled

Example with error handling:

```typescript
try {
  const response = await shopCertification.logOrder({
    email: 'customer@example.com',
    orderId: '12345'
  })
  console.log('Order logged successfully:', response)
}
catch (error) {
  console.error('Failed to log order:', error.message)
}
```

## Typescript Support

This module is written in TypeScript and includes type definitions out of the box.

## Development

### Running Tests

```bash
# npm
npm run test

# yarn
yarn test

# pnpm
pnpm test
```

### Building

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm build
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Andreas Sonnleitner](https://github.com/asonnleitner)

## Support

For any questions about the service itself, please contact [Heureka support](http://onas.heureka.cz/kontakty).

For technical issues with this NPM module, please open an issue on GitHub.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/overeno-zakazniky?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/overeno-zakazniky
[npm-downloads-src]: https://img.shields.io/npm/dm/overeno-zakazniky?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/overeno-zakazniky
[bundle-src]: https://img.shields.io/bundlephobia/minzip/overeno-zakazniky?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=overeno-zakazniky
[license-src]: https://img.shields.io/github/license/asonnleitner/overeno-zakazniky.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/asonnleitner/overeno-zakazniky/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/overeno-zakazniky
