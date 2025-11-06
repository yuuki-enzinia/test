
export {}; // ←これだけでモジュール扱いになる

const hello = () => {
  console.log("Hello");
}
export {};

// --------------------
// 型定義
// --------------------
type Primitive = string | number | boolean;
type NestedData = Primitive | NestedObject | NestedArray;

interface NestedObject {
  [key: string]: NestedData;
}

type AnyData = Record<string, NestedData>;

interface NestedArray extends Array<NestedData> {}

// --------------------
// deepEqual: 2つの NestedData の型と値が同じか
// --------------------
function deepEqual(a: NestedData, b: NestedData): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  if (Array.isArray(a) || Array.isArray(b)) return false;
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const aKeys = Object.keys(a as NestedObject);
    const bKeys = Object.keys(b as NestedObject);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(key => (b as NestedObject).hasOwnProperty(key) && deepEqual((a as NestedObject)[key], (b as NestedObject)[key]));
  }
  return typeof a === typeof b && a === b;
}

// --------------------
// compareMultipleAnyData: 3つ以上の AnyData が同じか比較
// --------------------
function compareMultipleAnyData(...datas: AnyData[]): boolean {
  if (datas.length < 2) return true;
  const [first, ...rest] = datas;
  return rest.every(d => deepEqual(first, d));
}

// --------------------
// mergeNestedData: 2つの NestedData をマージ
// --------------------
function mergeNestedData(a: NestedData, b: NestedData): NestedData {
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
  if (Array.isArray(a) || Array.isArray(b)) return b;
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const result: NestedObject = { ...a };
    for (const key in b as NestedObject) {
      if (key in result) result[key] = mergeNestedData(result[key], (b as NestedObject)[key]);
      else result[key] = (b as NestedObject)[key];
    }
    return result;
  }
  return b;
}

// --------------------
// mergeMultipleAnyData: 3つ以上の AnyData を順番にマージ
// --------------------
function mergeMultipleAnyData(...datas: AnyData[]): AnyData {
  return datas.reduce((acc, curr) => mergeNestedData(acc, curr) as AnyData, {});
}

// --------------------
// 使用例
// --------------------
const a: AnyData = { x: 1, y: [1, 2], z: { m: true } };
const b: AnyData = { x: 2, y: [3], z: { m: false }, newKey: "hello" };
const c: AnyData = { x: 2, y: [4], z: { m: false }, extra: 123 };

console.log("compareMultipleAnyData:", compareMultipleAnyData(a, b, c)); 
// false
console.log("mergeMultipleAnyData:", mergeMultipleAnyData(a, b, c)); 
/*
{
  x: 2,
  y: [1,2,3,4],
  z: { m: false },
  newKey: "hello",
  extra: 123
}
*/
