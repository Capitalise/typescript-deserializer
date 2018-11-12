import { MetadataInspector } from '@loopback/metadata';
import { DECORATOR_KEY, DeserializerMetadata } from './decorator';

export interface JsonMap {
    [key: string]: JsonMap | any;
}

export interface KeyTransformerMap {
    [key: string]: string;
}

export interface ValueTransformerMap {
    [key: string]: (...args: any[]) => any;
}

export class Deserializer {
    public static deserialize<T> (Clazz: any, jsonObject: JsonMap): T {
        if (typeof Clazz === 'undefined' || Clazz === null) {
            throw new Error('Can\'t deserialize object, no Class provided');
        }

        if (typeof jsonObject === 'undefined' || jsonObject === null) {
            return new Clazz();
        }

        // Get the list of props to be converted
        const classProps = MetadataInspector.getAllPropertyMetadata<DeserializerMetadata>(
            DECORATOR_KEY,
            Clazz.prototype,
        ) || {};

        // Get all value transformers from the decorator
        const valueTransformer = Object
            .keys(classProps)
            .filter((key) => typeof classProps[key].map !== 'undefined')
            .reduce<ValueTransformerMap>((acc, key) => ({
                ...acc,
                [key]: classProps[key].map as () => any,
            }), {})
        ;

        // Get all key transformers from the decorator
        const keyTransformer = Object
            .keys(classProps)
            .filter((key) => typeof classProps[key].jsonKey !== 'undefined')
            .reduce<KeyTransformerMap>((acc, key) => ({
                ...acc,
                [key]: classProps[key].jsonKey as string,
            }), {})
        ;

        // For each decorator added to the class apply the key and value transformers.
        return Object
            .keys(classProps)
            .reduce<T>(this.assign<T>(jsonObject, valueTransformer, keyTransformer), new Clazz());
    }

    /**
     * @name toDate
     * @description
     * Converts the input into a Javascript Date.
     *
     * Note: If the argument is a number it will assume its an timestamp.
     */
    public static toDate (input: string | number): Date {
        if (typeof input === 'undefined' || input === null) {
            return input;
        }

        if (typeof input === 'number') {
            return new Date(input * 1000);
        }

        return new Date(input);
    }

    /**
     * @name fromArray
     * @description
     * Allows transforming every array element
     */
    public static fromArray<T> (fn: (...args: any[]) => T) {
        return (arr: any[]): T[] => (arr || []).map(fn);
    }

    /**
     * @name fromObject
     * @description
     * Allows transforming every object property
     */
    public static fromObject (func: (...args: any[]) => any) {
        return (object: JsonMap) => {
            if (typeof object === 'undefined' || object === null) {
                return object;
            }

            return Object
                .entries(object)
                .reduce((res: JsonMap, [ key, value ]) => {
                    res[key] = func(value);

                    return res;
                }, {});
        };
    }

    /**
     * @name parseInt
     * @description
     * Wrapper around parseInt with a fixed radix
     */
    public static parseInt (str: string): number {
        return parseInt(str, 10);
    }

    private static assign<T> (
        source: JsonMap,
        valueTransformer: ValueTransformerMap,
        keyTransformer: KeyTransformerMap,
    ) {
        return (instance: T | any, prop: string): T => {
            // If a key transformer exists use it otherwise use the class property
            const sourceKey = typeof keyTransformer[prop] !== 'undefined'
                ? keyTransformer[prop]
                : prop
            ;

            // If a value transformer exists call it with the source value, otherwise use the value directly
            const transformedValue = typeof valueTransformer[prop] !== 'undefined'
                ? valueTransformer[prop](source[sourceKey])
                : source[sourceKey]
            ;

            // Set the transformed value only if the property exists on the json object
            instance[prop] = typeof source[sourceKey] === 'undefined'
                ? instance[prop]
                : transformedValue;

            return instance;
        };
    }
}
