export {}; // モジュール扱い

type AnyData = { [key: string]: string };

const a: AnyData = { name: "Alice" };
const b: AnyData = { name: "Alice" };

// 型レベルで b が AnyData か確認する条件型
type IsAnyData<T> = T extends AnyData ? true : false;
type CheckB = IsAnyData<typeof b>; // true なら b は AnyData 型

// a を処理する関数
function processA(data: AnyData) {
  return { ...data, processedFor: "a" };
}

// b を処理する関数
function processB(data: AnyData) {
  return { ...data, processedFor: "b" };
}

// a と b の処理
const resultA = processA(a);
const resultB = processB(b);

console.log(resultA); // { name: "Alice", processedFor: "a" }
console.log(resultB); // { name: "Alice", processedFor: "b" }

// 型チェックの確認（開発時のみ、実行時には消える）
type AssertBIsAnyData = CheckB extends true ? typeof b : never;
