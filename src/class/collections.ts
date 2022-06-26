interface ICollections {
  [key: string]: {
    name: string;
    data: number[]
  }
}

class Collections {
  private keyName = 'my-collection';

  constructor() {
    if (!this.storage) {
      localStorage.setItem(this.keyName, `{}`);
    }
  }

  private set storage(obj: ICollections) {
    localStorage.setItem(this.keyName, JSON.stringify(obj))
  }

  private get storage(): ICollections {
    return JSON.parse(localStorage.getItem(this.keyName) as string);
  }

  private get generateRandomID() {
    return Math.random().toString(16).slice(2);
  }

  findCollectionByName(name: string) {
    const ids = Object.keys(this.storage);
    const index = ids.findIndex(id => this.storage[id].name.toLowerCase() === name.toLowerCase());
    const id = ids[index];

    return !!id ? this.storage[id] : null;
  }
  
  create(name: string) {
    if (!this.findCollectionByName(name)) {
      this.storage = {...this.storage, [this.generateRandomID]: { name, data: [] }};
    }
    return this.storage;
  }

  rename(name: string, id: string) {
    if (!this.findCollectionByName(name)) {
      const collection = this.storage[id];
      collection.name = name; 
  
      this.storage = {...this.storage, [id]: { ...collection }}; 
    }

    return this.storage;
  }

  delete(collectionId: string) {
    const collections = this.storage;
    delete collections[collectionId];
    this.storage = collections;

    return this.storage;
  }

  get(id = null) {
    return !!id ? this.storage[id] : this.storage;
  }

  hasBeenAdded(animeId: number) { 
    const ids = Object.keys(this.get());
    const names = [];
    for (const id of ids) {
      if (this.storage[id].data.includes(animeId)) {
        names.push({ name: this.storage[id].name, id});
      }
    }

    return names;
  }

  addToCollections(animeId: number | number[], id: string) {
    const collections = this.storage;
    let collection = this.storage[id];

    if (collection) {
      if (Array.isArray(animeId)) {
        const notAdded = animeId.filter(x => !collection.data.includes(x));
        collection.data = [...collection.data, ...notAdded];
      } else {
        !collection.data.includes(animeId) && collection.data.push(animeId);
      }
      this.storage = {...collections, [id]: { ...collection }};
    }

    return this.storage;
  }

  removeFromCollections(animeId: number, id: string) {
    const collection = this.storage[id];

    if (collection) {
      const newData = collection.data.filter(x => x.toString() !== animeId.toString());
      collection.data = newData;
      this.storage = {...this.storage, [id]: { ...collection }};
    }

    return this.storage;
  }
}

export default new Collections();