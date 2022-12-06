import useTest from "./useTest";

const TestComp = () => {
  const test = useTest(
    "simple-axios",
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("test");
      }, 3000);
    })
  );
  return <div>{test}</div>;
};

export default TestComp;
