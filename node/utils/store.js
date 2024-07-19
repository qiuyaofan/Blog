class Store {
  constructor() {
    this.store = {};
  }
  put(name, value) {
    this.store[name] = value;
  }
  get(name) {
    return this.store[name];
  }
  filterStart(name) {
    return Object.keys(this.store)
      .filter((x) => x.indexOf(name) === 0)
      .map((x) => [x, this.get(x)]);
  }
  remove(name) {
    if (!this.store[name]) return;
    delete this.store[name];
  }
}

module.exports = Store;
