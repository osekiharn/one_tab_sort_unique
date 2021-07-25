const ul = document.querySelector('.ul');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const title = document.head.getElementsByTagName('title')[0]
    const now = new Date();
    title.innerHTML = `${now.getFullYear()}/${(now.getMonth() + 1)}/${now.getDate()}`
    message.forEach(msg => {
        const { id, favIconUrl, title, url } = msg
        generateList({ id, favIconUrl, title, url })
    })
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
