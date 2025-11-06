export {}; 

type Primitive = string | number | boolean;
type NestedData = Primitive | NestedObject | NestedArray;

interface NestedObject {
  [key: string]: NestedData;
}
interface NestedArray extends Array<NestedData> {}
const example: NestedObject = {
  name: "hello",
  age: "hello".toString(),
  address: { city: "hello" },
  favorites: ["hello", "helllo"],
};


