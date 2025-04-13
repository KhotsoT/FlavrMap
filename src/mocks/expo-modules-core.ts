// Mock implementation of expo-modules-core for web
export const requireOptionalNativeModule = () => null;

// Mock CodedError class
export class CodedError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'CodedError';
  }
}

// Mock UnavailabilityError class
export class UnavailabilityError extends Error {
  constructor(moduleName: string, functionName: string) {
    super(`The method or property ${functionName} is not available on ${moduleName}, are you sure you've linked all the native dependencies properly?`);
    this.name = 'UnavailabilityError';
  }
}

export const EventEmitter = class {
  constructor() {
    // Empty constructor
  }
  addListener() {
    return { remove: () => {} };
  }
  removeAllListeners() {
    // Empty implementation
  }
};

// Mock NativeModulesProxy
export const NativeModulesProxy = {
  ExpoUpdates: {
    manifest: null,
    manifestString: null,
  }
};

// Add Platform mock
export const Platform = {
  OS: 'web',
  select: (obj: any) => obj.web || obj.default
};

// Mock requireNativeModule
export const requireNativeModule = () => null; 