export function async(key, callback, options = {
  staletime: 15
}) {
  return () => {
    // check for data
    const data = __async.data[str];
    // if data exists;
    if (data) {
      if (new Date().getTime() - data.timestamp > options.staletime * 1000) {
        return callback()
      }
      return Promise.resolve(data)
    }
    // if no data exists but the page has loaded, we return the callback;
    if (__async.ended) {
      return callback();
    }
    // No data but still loading;
    return new Promise((resolve, reject) => {
      // subscribe
      __async.subscribe((event, payload) => {
        // loaded our data, lets resolve the promise
        if (event === "load" && payload?.id === key) {
          resolve(payload?.data);
        }
        // page ended without our data, lets 
        if (event === "end") {
          callback().then((data) => resolve(data)).catch((e) => reject(e))
        }
      })
    })
  }
}