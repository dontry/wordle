import '@testing-library/jest-dom/extend-expect';

class LocalStorageMock {
  public length = 0;
  private store: Record<string, string> = {};
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string): string {
    return this.store[key]
  }

  setItem(key: string, value: any) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }
}

global.localStorage = new LocalStorageMock();

const observe = jest.fn();
const unobserve = jest.fn();
const disconnect = jest.fn();

// you can also pass the mock implementation
// to jest.fn as an argument
window.IntersectionObserver = jest.fn(() => ({
  observe,
  unobserve,
  disconnect,
})) as any;


global.afterEach(() => {
  global.localStorage.clear();
})
