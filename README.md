# generator-react-helper-tool [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

```
yo react-helper-template
```

## License

© [Lokesh Kumar]()

## Model Generator

This generator helps create TypeScript model classes from JSON data. It automatically handles nested objects and arrays, creating separate model files for complex types.

## Usage

```bash
yo react-helper-template
```

Follow the prompts:
1. Enter the name of your model class (e.g., "User" or "UserModel")
2. Paste your JSON data
3. Specify the output directory (default: src/shared/dto)

## Example

Input JSON:
```json
{
  "id": 1,
  "user_name": "John",
  "is_active": true,
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "zip": "02101"
  },
  "orders": [
    {
      "order_id": 1,
      "items": ["item1", "item2"]
    }
  ]
}
```

This will generate the following files:

```typescript
// UserModel.ts
import { AddressModel } from './AddressModel';
import { OrderModel } from './OrderModel';

export class UserModel {
    id: number;
    userName: string;
    isActive: boolean;
    address: AddressModel;
    orders: OrderModel[];

    constructor(id: number, userName: string, isActive: boolean, address: AddressModel, orders: OrderModel[]) {
        this.id = id;
        this.userName = userName;
        this.isActive = isActive;
        this.address = address;
        this.orders = orders;
    }

    static fromApiResponse(response: any): UserModel {
        return new UserModel(response.id, response.user_name, response.is_active, response.address, response.orders);
    }

    toApiRequest(): any {
        return {
            id: this.id,
            user_name: this.userName,
            is_active: this.isActive,
            address: this.address,
            orders: this.orders
        };
    }
}

// AddressModel.ts
export class AddressModel {
    street: string;
    city: string;
    zip: string;

    constructor(street: string, city: string, zip: string) {
        this.street = street;
        this.city = city;
        this.zip = zip;
    }

    static fromApiResponse(response: any): AddressModel {
        return new AddressModel(response.street, response.city, response.zip);
    }

    toApiRequest(): any {
        return {
            street: this.street,
            city: this.city,
            zip: this.zip
        };
    }
}

// OrderModel.ts
export class OrderModel {
    orderId: number;
    items: string[];

    constructor(orderId: number, items: string[]) {
        this.orderId = orderId;
        this.items = items;
    }

    static fromApiResponse(response: any): OrderModel {
        return new OrderModel(response.order_id, response.items);
    }

    toApiRequest(): any {
        return {
            order_id: this.orderId,
            items: this.items
        };
    }
}
```

## Features

- Converts snake_case to camelCase for property names
- Automatically generates nested model classes
- Includes TypeScript type definitions
- Generates constructor, fromApiResponse, and toApiRequest methods
- Handles arrays of primitive types and objects
- Maintains proper import statements between related models

## Supported Types

- String
- Number
- Boolean
- Arrays (both primitive and object types)
- Nested Objects
- Any (fallback type)

[npm-image]: https://badge.fury.io/js/generator-react-helper-tool.svg
[npm-url]: https://npmjs.org/package/generator-react-helper-tool
[travis-image]: https://travis-ci.com/neodisk17/generator-react-helper-tool.svg?branch=master
[travis-url]: https://travis-ci.com/neodisk17/generator-react-helper-tool
[daviddm-image]: https://david-dm.org/neodisk17/generator-react-helper-tool.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/neodisk17/generator-react-helper-tool
