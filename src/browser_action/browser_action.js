let normal = document.querySelector('#normal');
let short = document.querySelector('#short');
let status = document.querySelector('#status');
let copyButton = document.querySelector('#copyButton');

copyButton.onclick = function(event) {
  navigator.clipboard.writeText(document.querySelector('#short-link').textContent).then(_ => {
    status.textContent = 'Copied!';
    setTimeout(() => status.textContent = '', 5 * 1000);
  }).catch(err => {
    status.textContent = `Error! ${JSON.stringify(err)}`;
  })
};

async function getCurrentTab() {
  return new Promise((resolve, reject) => {
    let queryOptions = {
      active: true,
      currentWindow: true
    };
    chrome.tabs.query(queryOptions, (tabs) => {
      resolve(tabs[0]);
    });
  })
}

getCurrentTab().then((tab, other) => {
    console.log(tab.url);
    normal.textContent = tab.url;
    return fetch('http://url.eluni.co/create', {
      method: "POST",
      body: JSON.stringify({
        url: tab.url
      }),
      headers: {
        "Access-Control-Allow-Origin": "chrome-extension://kmacaiolcdbekgdnhdcplgmgjemkjcja",
        "Content-Type": "application/json"
      }
    })
  })
  .then(resp => resp.json())
  .then(data => {
    if (!data.success) {
      throw 'Unknown issue!'
    }
    short.innerHTML = `<a id="short-link" href="http://url.eluni.co/v/${data.path}">http://url.eluni.co/v/${data.path}</a>`

  })
  .catch(err => alert(err));
