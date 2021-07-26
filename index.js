const ul = document.querySelector('.ul');
const createBookmarkBtn = document.querySelector('.create-bookmark-button');

chrome.runtime.onMessage.addListener((message, _, __) => {
    const title = document.head.getElementsByTagName('title')[0]
    const now = new Date();
    const datetime = `${now.getFullYear()}${('00' + (now.getMonth() + 1)).slice(-2)}${('00' + now.getDate()).slice(-2)}`
    title.innerHTML =  datetime
    message.forEach(msg => {
        const { id, favIconUrl, title, url } = msg
        generateList({ id, favIconUrl, title, url })
    })
    createBookmarkBtn.addEventListener('click', createBookmark(datetime, message))
})

function generateList ({ id, favIconUrl, title, url }) {
    const li = document.createElement('li')
    const a = document.createElement('a')
    const img = document.createElement('img')
    img.src = favIconUrl;
    img.width = 16;
    img.height = 16;
    a.innerText = title;
    a.href = url;
    a.target = '_blank'
    li.key = id
    li.appendChild(img)
    li.appendChild(a)
    ul.appendChild(li)
}

// 日付のブックマークフォルダに保存
function createBookmark(title, message) {
    return function() {
        chrome.bookmarks.create({ title }, (parent) => {
            message.forEach(async (msg) => {
                await chrome.bookmarks.create({ parentId: parent.id, title: msg.title, url: msg.url })
            })
        })
    }
}
