// アイコンクリック時
chrome.action.onClicked.addListener(async function(tab) {
    const windows = await chrome.windows.getAll();

    const ids = windows.map(win => win.id)

    const tabs = []

    for (let i = 0; i < windows.length; i++) {
      tabs.push(await new Promise((resolve, reject) => {
        try {
          chrome.tabs.query({ windowId: windows[i].id }, (t) => {
            return resolve(t);
          })
        } catch (e) {
          reject(e)
        }
      }))
    }

    const ordered = sort_uniq_url(tabs.flat())
    
    // const chunked = chunk(ordered, windows.length)

    // 作る前に消す
    // removeWindows(windows)

    chrome.windows.create({ url: 'index.html' }, (win) => {
        console.log(win)
        setTimeout(() => {
          chrome.tabs.sendMessage(win.tabs[0].id, ordered, null)
        }, 1000)
    })
})


async function removeWindows(windows) {
    for (let i = 0; i < windows.length; i++) {
        await chrome.windows.remove(windows[i].id)
    }
}

/**
 * sort and unique
 */
function sort_uniq_url(arr) {
    if (arr.length === 0) return arr;
    arr = arr.sort((a, b) => {
        if (a.url < b.url) return -1;
        if (a.url > b.url) return 1;
        return 0
    })
    const ret = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i-1].url !== arr[i].url) {
            ret.push(arr[i]);
        } else {
            console.log('dupulicated')
        }
    }
    return ret;
}


function chunk(array, divide) {
    const quotient = Math.floor(array.length / divide)
    const remainder = array.length % divide; 
    const result = [...Array(divide)].map((_, i) => {
        if (remainder === 0) {
            return quotient
        }
        if (remainder >= (i + 1)) {
          return quotient + 1
        } else {
            return quotient
        }
    })
    return result.map((x, _) => array.splice(0, x));
}

