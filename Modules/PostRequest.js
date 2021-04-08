function postRequest(obj) {
  const fetch = require('node-fetch');
  return new Promise(resolve => {
    fetch(obj.url, {
      method: 'POST',
      headers: obj.headers,
      body: obj.body
    })
    .then((res) => {
      resolve(res.json())
    });
  });
}
export default postRequest