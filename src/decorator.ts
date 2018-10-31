import { PropertyDecoratorFactory } from '@loopback/metadata';

export const DECORATOR_KEY = 'deserializer-metadata-key';

export interface DeserializerMetadata {
    /**
     * @name jsonKey
     * @description
     * Key for the property on the JSON object. If set will transform the provided key to the class property.
     * By default this is set to the class property name.
     */
    jsonKey?: string;
    /**
     * @name map
     * @description
     * Optional map function used to transform the json property before setting the class property.
     */
    map?: (...args: any[]) => any;
}

export function JsonProperty(spec?: DeserializerMetadata): PropertyDecorator {
    return PropertyDecoratorFactory.createDecorator<DeserializerMetadata>(
        DECORATOR_KEY,
        spec || {},
    );
}
