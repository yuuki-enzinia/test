
export {}; // ←これだけでモジュール扱いになる

const hello = () => {
  console.log("Hello");
}
type AnyData = {
  [key: string]: string 
};

const a: AnyData = { name: "Alice",  };
const b: AnyData = { name: "Alice",  };

type IsSameType<T, U> = T extends U ? (U extends T ? true : false) : false;

// a と b の型をチェック
type Check = IsSameType<typeof a, typeof b>;
