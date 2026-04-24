// 存放頻道網址
let channelname = '';

const MESSAGE_SELECTOR = 'yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer'; // YouTube 直播訊息的選擇器，包含一般訊息和付費訊息
const BTN_CLASS = 'my-hover-channel-btn'; // 懸浮按鈕的 CSS 類名



// 從訊息元素中提取頻道名稱
function getChannelNameFromMessage(message) {
    const nameElement = message.querySelector('#author-name');
    if (!nameElement) {
        return '';
    }

    
    return nameElement.textContent.trim(); 
}

// 確保訊息元素上有懸浮按鈕，並返回該按鈕
function ensureHoverButton(message) {
    let btn = message.querySelector(`.${BTN_CLASS}`);  // 嘗試找到已存在的按鈕
    if (btn) {
        return btn;
    }

    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = BTN_CLASS;
    btn.textContent = '前往頻道';
    btn.style.cssText = [
        'position: absolute',
        'top: 6px',
        'right: 6px',
        'z-index: 10',
        'display: none',
        'padding: 4px 8px',
        'font-size: 12px',
        'font-weight: 600',
        'border: 0',
        'border-radius: 12px',
        'color: white',
        'background: rgba(0, 0, 0, 0.75)',
        'cursor: pointer'
    ].join(';');

    btn.addEventListener('click', (event) => {
        event.preventDefault(); // 阻止默認行為（如果有的話）
        event.stopPropagation(); // 阻止事件冒泡，避免觸發其他事件處理器

        const name = btn.dataset.channelname || ''; // 從按鈕的 data-channelname 屬性中獲取頻道名稱
        if (name) {
            const channelUrl = `https://www.youtube.com/${name}`;
            window.open(channelUrl, '_blank', 'noopener'); 
        } else {
            console.log('無法獲取頻道網址！');
        }
    });

    if (getComputedStyle(message).position === 'static') {
        message.style.position = 'relative';
    }

    message.appendChild(btn);
    return btn;
}

document.addEventListener('mouseover', (e) => {
    const message = e.target.closest(MESSAGE_SELECTOR);
    if (!message) {
        return;
    }

    channelname = getChannelNameFromMessage(message);
    if (channelname) {
        console.log('%c[Debug] 抓到頻道網址:', 'color: cyan; font-weight: bold;', channelname);
    } else {
        console.log('%c[Debug] 無法抓到頻道網址！', 'color: red; font-weight: bold;');
    }

    const btn = ensureHoverButton(message); // 確保訊息元素上有懸浮按鈕，並獲取該按鈕
    btn.dataset.channelname = channelname; // 將頻道名稱存儲在按鈕的 data-channelname 屬性中，供點擊事件使用
    btn.style.display = 'inline-block';
});

// 當鼠標移出訊息元素時，隱藏懸浮按鈕
document.addEventListener('mouseout', (e) => {
    const message = e.target.closest(MESSAGE_SELECTOR);
    if (!message) {
        return;
    }

    const btn = message.querySelector(`.${BTN_CLASS}`);
    if (!btn) {
        return;
    }

    const nextTarget = e.relatedTarget;
    if (nextTarget && (message.contains(nextTarget) || btn.contains(nextTarget))) {
        return;
    }

    btn.style.display = 'none';
});

//在按鈕上懸停，改變按鈕樣式
document.addEventListener('mouseover', (e) => {
    const btn = e.target.closest(`.${BTN_CLASS}`); // 嘗試找到按鈕元素
    if (btn) {
        btn.style.background = 'rgba(70, 67, 67, 0.75)';
    }
});

//在按鈕上移出，恢復按鈕樣式
document.addEventListener('mouseout', (e) => {
    const btn = e.target.closest(`.${BTN_CLASS}`);
    if (btn) {
        btn.style.background = 'rgba(0, 0, 0, 0.75)';
    }
});