Typescript Deserializer
======================================

A typescript based JSON deserializer that permits converting raw Javascript/JSON Objects into typescript classes. Using decorators it becomes simple to define which class members should be deserialized and optionaly mapped into different values.

## Goals
* Class deserialization from raw Javascript/JSO Objects
* Class member deserialization using decorator for greater flexibility
* Allow key transformation to change those `snake_cases` into `camelCases`
* Allow value transformation for automatic convertions and calculations

## Installation

### Via yarn
```sh
yarn install capitalise/typescript-deserializer
```

### Via npm
```sh
npm install capitalise/typescript-deserializer
```

## Usage

### Import
```typescript
import { JsonProperty, Deserializer } from 'typescript-deserializer';
```

### Simple usage
```typescript
import { JsonProperty, Deserializer } from 'typescript-deserializer';

class ExampleClass {
    @JsonProperty()
    public prop1: string;
}

const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, { prop1: 'Example Prop 1' });

instance.prop1;
// → "Example Prop 1"
```

### Key transformation
```typescript
import { JsonProperty, Deserializer } from 'typescript-deserializer';

class ExampleClass {
    @JsonProperty({ jsonKey: 'ugly_prop' })
    public prop2: string;
}

const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, { ugly_prop: 'Example Prop 2' });

instance.prop2;
// → "Example Prop 2"
```

### Value transformation
```typescript
import { JsonProperty, Deserializer } from 'typescript-deserializer';

class ExampleClass {
    @JsonProperty({
        map: (value: string) => parseInt(value, 10),
    })
    public prop3: number;
}

const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, { prop3: '33' });

instance.prop3;
// → 33

typeof instance.prop3;
// → "number"
```

### Ignoring properties without decorators
```typescript
import { JsonProperty, Deserializer } from 'typescript-deserializer';

class ExampleClass {
    public prop4: string;
}

const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, { prop4: 'Example Prop 4' });

instance.prop4;
// → undefined
```

### Preserving default values
```typescript
import { JsonProperty, Deserializer } from 'typescript-deserializer';

class ExampleClass {
    @JsonProperty()
    public prop5: string = 'Awesome Default Value';
}

const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, { otherProp: 'Other Example Prop' });

instance.prop5;
// → "Awesome Default Value"
```

### Deserialize function has static method
```typescript
import { JsonProperty, Deserializer } from 'typescript-deserializer';

class ExampleClass {
    @JsonProperty()
    public prop6: string;

    static deserialize (jsonObject: Object): ExampleClass {
        return Deserializer.deserialize<ExampleClass>(ExampleClass, jsonObject);
    }
}

const instance = ExampleClass.deserialize({ prop6: 'Example Prop 6' });
instance.prop6;

// → "Example Prop 6"
```

## Building/Testing

* Runs linter and tests with:
```sh
yarn test
```
* Builds library and types:
```sh
yarn build
```

## TODO
- [ ] Remove `@loopback/metadata` dependency