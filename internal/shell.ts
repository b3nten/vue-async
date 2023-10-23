const import_map = {
  imports: {
    "vue": "https://esm.sh/vue",
    "vue/": "https://esm.sh/vue/",
    // "/internal/": "/internal/client/",
  },
};

export async function shell_open() {
  return `<!DOCTYPE html>
<html lang="en">
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <script type="importmap">${JSON.stringify(import_map)}</script>
  <script type="module" async src="/internal/client/bootstrap.js"></script>
  <title>Title</title>
</head>
<body>
<div id="__app">`;
}

export function root_close() {
  return `</div><script type="module" src="/internal/client/app.tsx"></script>`;
}

export function shell_close() {
  return `<script>window.__async.end();</script></body></html>`;
}
