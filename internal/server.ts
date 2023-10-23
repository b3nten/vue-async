import { Hono } from "https://deno.land/x/hono/mod.ts";
import Renderer from "./renderer.ts";
import esbuild from "npm:esbuild";

export class Application {
  public hono = new Hono();
  public all = this.hono.all;
  public get = this.hono.get;
  public post = this.hono.post;
  public patch = this.hono.patch;
  public put = this.hono.put;

  #renderer = new Renderer();

  async build(entry: string) {
    const src = await esbuild.build({
      entryPoints: [entry],
      write: false,
      jsx: "automatic",
      jsxImportSource: "vue"
    });
    return src.outputFiles[0].text;
  }

  constructor() {
    this.hono.get("/internal/client/*", async (c) => {
      return new Response(
        await this.build(
          "." +
            new URL(c.req.url).pathname,
        ),
        {
          headers: { "content-type": "text/javascript" },
        },
      );
    });
    this.hono.get("/", async (c) => {
      return this.#renderer.Render();
    });
  }

  public start() {
    Deno.serve({ port: 8000 }, this.hono.fetch);
  }
}
