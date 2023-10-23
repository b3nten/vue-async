import * as shell from "./shell.ts";
import App from "./app.tsx";
import { renderToString } from "./deps.ts";
import { AsyncContext, createAsyncPool } from "./async.ts";

const text_encoder = new TextEncoder();
const sleep = async (ms: number) => new Promise((r) => setTimeout(r, ms));

export default class Renderer {
  async #render(stream: TransformStream): Promise<void> {
    let writer = stream.writable.getWriter();
    writer.write(text_encoder.encode(await shell.shell_open()));
    await sleep(1000);
    const asyncPool = createAsyncPool();
    const str = await renderToString(App);
    await writer.write(text_encoder.encode(str + shell.root_close())).catch(() => {})
    await sleep(1000);
    writer.releaseLock();
    await asyncPool.flush(stream.writable).catch(() => {})
    await sleep(1000)
    writer = stream.writable.getWriter()
    writer.write(text_encoder.encode(shell.shell_close())).then(() =>
      writer.close()
    ).catch(() => {})
  }

  public async Render() {
    const body = new TransformStream();
    this.#render(body);
    return new Response(body.readable, {
      headers: {
        "content-type": "text/html",
        "x-content-type-options": "nosniff",
        "transfer-encoding": "chunked",
      },
    });
  }
}
