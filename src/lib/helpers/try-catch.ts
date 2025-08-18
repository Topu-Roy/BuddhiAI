// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T>(promiseOrFn: Promise<T> | (() => Promise<T>)): Promise<Result<T>> {
  try {
    const promise = typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    const errorObj =
      error instanceof Error ? error : new Error(typeof error === "string" ? error : "Unknown error occurred");

    return { data: null, error: errorObj };
  }
}
