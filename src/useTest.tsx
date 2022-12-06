type stringKeyObject = { [key: string]: any };

const promises: stringKeyObject = {};

const result: stringKeyObject = {};

export default function useTest(name: string, promise: Promise<any>) {
  if (!promises[name]) {
    promises[name] = {
      instance: promise.then(
        (r) => {
          promises[name].status = "fulfilled";
          result[name] = r;
        },
        (e) => {
          promises[name].status = "error";
          result[name] = e;
        }
      ),
      status: "pending",
    };
    throw promises[name].instance;
  } else {
    if (promises[name].status === "fulfilled") {
      return result[name];
    } else if (promises[name].status === "error") {
      throw result[name];
    } else if (promises[name].status === "pending") {
      throw promises[name].instance;
    }
  }
}
