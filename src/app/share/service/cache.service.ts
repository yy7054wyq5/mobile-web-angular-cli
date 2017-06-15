import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {
  store: Array<object> = [];
  constructor() { }

  get(key: string) {
    for (let index = 0; index < this.store.length; index++) {
      if (this.store[index][key]) {
        return this.store[index][key];
      }
    }
  }

  put(key: string, data: object): void {
    const tmp = {};
    tmp[key] = data;
    this.store.push(tmp);
  }
}
