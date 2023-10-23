import React from "https://esm.sh/react?dev";

type Callback = () => Promise<unknown>;
type Pool = Record<string, Promise<unknown>>;
type ResolvedPool = Record<string, unknown>;

type Add = (key: string, callback: Callback) => Callback;

export const AsyncContext = React.createContext<Add | null>(null);

const text_encoder = new TextEncoder();

export function createAsyncPool(): {
  add: Add;
  flush: (w: WritableStream) => Promise<void>;
} {
  const pool: Pool = {};
  const resolvedPool: ResolvedPool = {};
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  return {
    add(key: string, callback: Callback) {
      pool[key] = callback().then((c) => {
        resolvedPool[key] = c;
        writer.write(
          text_encoder.encode(
            `<script type="application/json" data-async-data="${key}">${
              JSON.stringify(c)
            }</script>`,
          ),
        ).catch(() => {});
      });
      return callback;
    },
    async flush(w) {
        const p = stream.readable.pipeTo(w, { preventClose: true }).catch(() => {})
        await Promise.all(Object.values(pool)).catch(() => {})
        await writer.close().catch(() => {})
        await p.catch(() => {})
    },
  };
}

export function async(str: string, callback: Callback) {
  const add = React.useContext(AsyncContext);
  if(!add) throw Error("async() called on server, but no AsyncContext available.")
  return add(str, callback);
}
