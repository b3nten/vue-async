window.__async ??= {
  ended: false,
  data: {},
  subscribers: [],
  subscribe(callback) {
    this.subscribers.push(callback);
  },
  end() {
    this.ended = true;
    this.subscribers.forEach((sub) => {
      sub("end")
    })
  }
};

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    mutation.addedNodes.forEach((node) => {
      if (node.dataset?.asyncData) {
        const id = node.dataset?.asyncData;
        const data = JSON.parse(node.innerHTML);
        window.__async.data[id] = {
          data,
          timestamp: new Date().getTime()
        }
        window.__async.subscribers.forEach((sub) => sub("load", { id, data }))
      }
    });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
