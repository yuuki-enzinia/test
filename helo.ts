export {}; 

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


function replaceAllWithHello(data: AnyData): AnyData {
  const result: AnyData = {};

  for (const key in data) {
    const value = data[key];

    if (Array.isArray(value)) {
      // 配列の場合、再帰的に変換
      result[key] = value.map(item => {
        if (typeof item === "object" && item !== null) {
          return Array.isArray(item) ? replaceArrayWithHello(item) : replaceObjectWithHello(item);
        }
        return "hello";
      });
    } else if (typeof value === "object" && value !== null) {
      // オブジェクトの場合、再帰的に変換
      result[key] = replaceObjectWithHello(value as NestedObject);
    } else {
      // プリミティブ値の場合は hello に置換
      result[key] = "hello";
    }
  }

  return result;
}

function replaceObjectWithHello(obj: NestedObject): NestedObject {
  const newObj: NestedObject = {};
  for (const key in obj) {
    const value = obj[key];
    if (Array.isArray(value)) {
      newObj[key] = replaceArrayWithHello(value);
    } else if (typeof value === "object" && value !== null) {
      newObj[key] = replaceObjectWithHello(value as NestedObject);
    } else {
      newObj[key] = "hello";
    }
  }
  return newObj;
}

function replaceArrayWithHello(arr: NestedArray): NestedArray {
  return arr.map(item => {
    if (Array.isArray(item)) return replaceArrayWithHello(item);
    if (typeof item === "object" && item !== null) return replaceObjectWithHello(item as NestedObject);
    return "hello";
  });
}

// 使い方例
const data: AnyData = {
  a: 1,
  b: { x: true, y: [2, 3, { z: "foo" }] },
  c: [false, { w: "bar" }]
};

console.log(replaceAllWithHello(data));
