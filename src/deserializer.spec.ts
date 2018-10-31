import { JsonProperty } from './decorator';
import { Deserializer } from './deserializer';

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

describe('deserialize()', () => {
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
});
