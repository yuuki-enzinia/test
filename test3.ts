export {}; 
type AnyData = {
  [key: string]: string 
};

const ab: AnyData = { name: "Alice",  };


type AType = typeof ab;
