// Define Autobind decorator - Tomislav
export function autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  return {
    configurable: true, // Add the 'configurable' property
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
}
