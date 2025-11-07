
export {}; // モジュール扱い

type AnyData = { [key: string]: string };

const a: AnyData = { name: "Alice" };
const b: AnyData = { name: "Alice" };
const c: AnyData = { name: "Alice" };

// 2つの型が同じか判定する条件型
type IsSameType<T, U> = T extends U ? (U extends T ? true : false) : false;

// まず a と b の型をチェック
type CheckAB = IsSameType<typeof a, typeof b>;

// 次に a と c の型をチェックして、両方同じなら true
type CheckABC = CheckAB extends true ? IsSameType<typeof a, typeof c> : false;

// 最終結果
type Result = CheckABC; // true なら a, b, c はすべて同じ型
