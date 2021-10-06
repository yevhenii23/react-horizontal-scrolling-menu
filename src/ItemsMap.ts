import type { IOItem, Item, visibleItems as itemsArr } from './types';
import { filterSeparators } from './helpers';

class ItemsMap extends Map<string, IOItem> {
  public toArr(): Item[] {
    return [...this];
  }

  public toItems(): itemsArr {
    return this.toArr().map((el) => el[0]);
  }

  public toItemsWithoutSeparators(): itemsArr {
    return filterSeparators(this.toItems());
  }

  // NOTE: for backward compatibility, to remove
  public toItemsKeys(): itemsArr {
    return this.toItems();
  }

  onlyDigits(value: string | number): string {
    return String(value).replace(/[^0-9.]/g, '');
  }
  public sort(arr: Item[]) {
    return arr.sort(
      (a: Item, b: Item) =>
        +this.onlyDigits(a[1].index) - +this.onlyDigits(b[1].index)
    );
  }

  set(key: Array<Item> | string, val?: IOItem): this {
    if (Array.isArray(key)) {
      this.sort(key).forEach((el) => {
        super.set(el[0], el[1]);
      });
    } else {
      super.set(key, val!);
    }
    return this;
  }

  public first(): IOItem | undefined {
    return this.toArr()[0]?.[1];
  }
  public last(): IOItem | undefined {
    return this.toArr().slice(-1)?.[0]?.[1];
  }

  public filter(
    predicate: (value: Item, index: number, array: Item[]) => boolean
  ): Item[] {
    return this.toArr().filter(predicate);
  }
  public find(
    predicate: (value: Item, index: number, obj: Item[]) => boolean
  ): Item | undefined {
    return this.toArr().find(predicate);
  }

  public findIndex(
    predicate: (value: Item, index: number, obj: Item[]) => unknown
  ): number {
    return this.toArr().findIndex(predicate);
  }
  public prev(item: string | IOItem): IOItem | undefined {
    const arr = this.toArr();
    const current = arr.findIndex((el) => el[0] === item || el[1] === item);
    return current !== -1 ? arr[current - 1]?.[1] : undefined;
  }
  public next(item: IOItem | string): IOItem | undefined {
    const arr = this.toArr();
    const current = arr.findIndex((el) => el[0] === item || el[1] === item);
    return current !== -1 ? arr[current + 1]?.[1] : undefined;
  }

  public getVisible() {
    return this.filter((value: Item) => value[1].visible);
  }

  // TODO: next visible group, prev visible group
  // with left, center and right items
  // sliding window
  // eg. currentItems: {left, center, right}, nextItems: {...}, prevItems: {...}
}
export default ItemsMap;
