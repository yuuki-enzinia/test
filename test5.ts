
export {}; // ←これだけでモジュール扱いになる
type AnyData = {
  [key: string]: string 
};

const a: AnyData = { name: "Alice",  };
const b: AnyData = { name: "Alice",  };
const c: AnyData = { name: "Alice" };
type IsSameType<T, U> = T extends U ? (U extends T ? true : false) : false;

// a と b の型をチェック
type CheckABC = CheckAB extends true ? IsSameType<typeof a, typeof c> : false;
type CheckAB = IsSameType<typeof a, typeof b>;
type Result = CheckABC;
