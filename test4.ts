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
 * a と b の差分を再帰的に取得
 */
function diffNestedData(a: NestedData, b: NestedData): NestedData | undefined {
  // 両方配列の場合
  if (Array.isArray(a) && Array.isArray(b)) {
    // b にあるが a にない要素を抽出
    const diff = b.filter(itemB =>
      !a.some(itemA => deepEqual(itemA, itemB))
    );
    return diff.length > 0 ? diff : undefined;
  }

  // 一方が配列、もう一方が配列でない場合
  if (Array.isArray(a) || Array.isArray(b)) return b;

  // 両方オブジェクトの場合
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const result: NestedObject = {};
    for (const key in b as NestedObject) {
      if (key in (a as NestedObject)) {
        const d = diffNestedData((a as NestedObject)[key], (b as NestedObject)[key]);
        if (d !== undefined) result[key] = d;
      } else {
        result[key] = (b as NestedObject)[key];
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }

  // プリミティブの場合は値が違えば差分として返す
  if (a !== b) return b;

  return undefined;
}

/**
 * AnyData の差分
 */
function diffAnyData(a: AnyData, b: AnyData): AnyData {
  const result: AnyData = {};
  for (const key in b) {
    if (key in a) {
      const d = diffNestedData(a[key], b[key]);
      if (d !== undefined) result[key] = d;
    } else {
      result[key] = b[key];
    }
  }
  return result;
}

/**
 * deepEqual は問題2で使った再帰的比較関数
 */
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

// 使用例
const a: AnyData = {
  x: 1,
  y: { z: true, arr: [1, 2] },
  w: "foo"
};

const b: AnyData = {
  x: 2,
  y: { z: true, arr: [2, 3] },
  newKey: "bar"
};

console.log(diffAnyData(a, b));

/*
出力例:
{
  x: 2,                   // 値が異なる
  y: { arr: [3] },        // 配列の差分
  newKey: "bar"            // bにしかないキー
}
*/
