export {}; // ←これだけでモジュール扱いになる

const hello = () => {
  console.log("Hello");
}
type Primitive = string | number | boolean;
type NestedData = Primitive | NestedObject | NestedArray;

interface NestedObject {
  [key: string]: NestedData;
}
type AnyData = Record<string, NestedData>;

interface NestedArray extends Array<NestedData> {}

/**
 * 2つの NestedData が型と値を含めて同じか比較する
 */
function deepEqual(a: NestedData, b: NestedData): boolean {
  // 両方配列の場合
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  // 一方が配列、もう一方が配列でない場合
  if (Array.isArray(a) || Array.isArray(b)) return false;

  // 両方オブジェクトの場合
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const aKeys = Object.keys(a as NestedObject);
    const bKeys = Object.keys(b as NestedObject);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(key => (b as NestedObject).hasOwnProperty(key) && deepEqual((a as NestedObject)[key], (b as NestedObject)[key]));
  }

  // プリミティブの場合は型と値を比較
  return typeof a === typeof b && a === b;
}

/**
 * AnyData を比較
 */
function compareAnyData(a: AnyData, b: AnyData): boolean {
  return deepEqual(a, b);
}

// 使用例
const a: AnyData = {
  x: 1,
  y: { z: true, arr: ["hello"] },
};

const b: AnyData = {
  x: 1,
  y: { z: true, arr: ["hello"] },
};

const c: AnyData = {
  x: 1,
  y: { z: "true", arr: ["hello"] }, // zの型が違う
};

console.log(compareAnyData(a, b)); // true
console.log(compareAnyData(a, c)); // false
