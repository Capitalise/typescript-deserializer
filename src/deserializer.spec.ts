import { Deserializer, JsonProperty } from './index';

describe('deserialize()', () => {
    class ExampleClass {
        @JsonProperty()
        public prop1: string;

        @JsonProperty({
            jsonKey: 'prop_2',
        })
        public prop2: string;

        @JsonProperty({
            map: (arg: string) => `${arg}_transformed`,
        })
        public prop3: string;

        public prop4: string;

        @JsonProperty({})
        public prop5: string = 'FAKE_DEFAULT_PROP5_VALUE';

        constructor () {
            this.prop1 = 'FAKE_DEFAULT_PROP1_VALUE';
            this.prop2 = 'FAKE_DEFAULT_PROP2_VALUE';
            this.prop3 = 'FAKE_DEFAULT_PROP3_VALUE';
            this.prop4 = 'FAKE_DEFAULT_PROP4_VALUE';
        }
    }

    let jsonObject: any;

    beforeEach(() => {
        jsonObject = {
            prop1: 'FAKE_PROP1_VALUE',
            prop3: 'FAKE_PROP3_VALUE',
            prop4: 'FAKE_PROP4_VALUE',
            prop_2: 'FAKE_PROP2_VALUE',
        };
    });

    test('should copy the json value', () => {
        const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, jsonObject);

        expect(instance.prop1).toEqual(jsonObject.prop1);
    });

    test('should use a different json key if a `jsonKey` prop is provided', () => {
        const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, jsonObject);

        expect(instance.prop2).toEqual(jsonObject.prop_2);
    });

    test('should transform the value if a `map` prop is provided', () => {
        const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, jsonObject);

        expect(instance.prop3).toEqual(`${jsonObject.prop3}_transformed`);
    });

    test('should ignore properties on the json object if no decorator is used', () => {
        const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, jsonObject);

        expect(instance.prop4).toEqual('FAKE_DEFAULT_PROP4_VALUE');
    });

    test('should maintain the class default value if the property is not present on the json object', () => {
        const instance = Deserializer.deserialize<ExampleClass>(ExampleClass, jsonObject);

        expect(instance.prop5).toEqual('FAKE_DEFAULT_PROP5_VALUE');
    });

    test('should throw if no class provided', () => {
        expect(() => (
            Deserializer.deserialize<ExampleClass>(undefined, {})
        )).toThrow();
    });

    test('should return an empty object if no object was provided', () => {
        expect(Deserializer.deserialize<ExampleClass>(ExampleClass, undefined as any)).toBeDefined();
    });

    test('should allow calling deserialize on a class without any decorators', () => {
        // tslint:disable-next-line: max-classes-per-file
        class NoDecoratorsClass {}
        expect(() => Deserializer.deserialize<NoDecoratorsClass>(NoDecoratorsClass, {})).not.toThrow();
    });
});

describe('toDate()', () => {
    test('should convert a string to a date', () => {
        const date = new Date();
        const mappedDate = Deserializer.toDate(date.toISOString());

        expect(mappedDate).toEqual(date);
    });

    test('should convert a unix timestamp to a date', () => {
        const date = new Date();
        const mappedDate = Deserializer.toDate(date.getTime() / 1000);

        expect(mappedDate).toEqual(date);
    });

    test('should return null if the value is null', () => {
        const mappedDate = Deserializer.toDate(null as any);

        expect(mappedDate).toEqual(null);
    });

    test('should return undefined if the value is undefined', () => {
        const mappedDate = Deserializer.toDate(undefined as any);

        expect(mappedDate).toEqual(undefined);
    });
});

describe('parseInt()', () => {
    test('should have the same behaviour has `parseInt` with base 10', () => {
        expect(Deserializer.parseInt('1')).toEqual(1);
        expect(Deserializer.parseInt('10')).toEqual(10);
        expect(Deserializer.parseInt('101')).toEqual(101);
        expect(Deserializer.parseInt('12345678')).toEqual(12345678);
    });
});

describe('fromArray()', () => {
    test('should call the provided function for each array element', () => {
        const mockTransformer = jest.fn();
        Deserializer.fromArray(mockTransformer)([1 , 4]);

        expect(mockTransformer).toHaveBeenCalledTimes(2);
        expect(mockTransformer.mock.calls[0][0]).toEqual(1);
        expect(mockTransformer.mock.calls[1][0]).toEqual(4);
    });

    test('should not throw if no argument is provided', () => {
        const mockTransformer = jest.fn();
        const result = Deserializer.fromArray(mockTransformer)(undefined as any);

        expect(result).toEqual([]);
    });
});

describe('fromObject()', () => {
    test('should call the provided function for each value on the object', () => {
        const mockTransformer = jest.fn();
        Deserializer.fromObject(mockTransformer)({
            one: 1,
            two: 4,
        });

        expect(mockTransformer).toHaveBeenCalledTimes(2);
        expect(mockTransformer.mock.calls[0][0]).toEqual(1);
        expect(mockTransformer.mock.calls[1][0]).toEqual(4);
    });

    test('should not throw if no argument is provided', () => {
        const mockTransformer = jest.fn();
        const result = Deserializer.fromObject(mockTransformer)(undefined as any);

        expect(result).toEqual({});
    });
});
