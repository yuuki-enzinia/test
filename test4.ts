export {}; // ←これだけでモジュール扱いになる

type AnyData = {
  [key: string]: string 
};

const a: AnyData = { name: "Alice",  };
const b: AnyData = { name: "Alice",  };

function processA(data: AnyData) {
  return { ...data, processedFor: "a" };
}

// b を処理する関数
function processB(data: AnyData) {
  return { ...data, processedFor: "b" };
}

// a と b の型をチェック
const resultA = processA(a);
const resultB = processB(b);

console.log(resultA);
console.log(resultB);
