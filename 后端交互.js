// 与后端 API 交互
const apiUrl = 'http://localhost:3000';

// 写信
document.getElementById('write-btn').addEventListener('click', () => {
    const message = prompt('请输入您的信件内容：');
    if (message) {
        localStorage.setItem('draft', message);
        alert('信件已保存，点击“投出漂流瓶”发送。');
    }
});

// 投出漂流瓶
document.getElementById('throw-btn').addEventListener('click', async () => {
    const message = localStorage.getItem('draft');
    if (message) {
        try {
            const response = await fetch(`${apiUrl}/bottles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('draft');
                alert('漂流瓶已投出！');
            }
        } catch (error) {
            console.error('投出漂流瓶失败:', error);
        }
    }
});

// 打捞漂流瓶
document.getElementById('fish-btn').addEventListener('click', async () => {
    try {
        const response = await fetch(`${apiUrl}/bottles`);
        const data = await response.json();
        if (data.success) {
            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = `收到信件：${data.message}`;
            localStorage.setItem('currentBottleId', data.id);
        }
    } catch (error) {
        console.error('打捞漂流瓶失败:', error);
    }
});

// 回复漂流瓶
document.getElementById('reply-btn').addEventListener('click', async () => {
    const reply = document.getElementById('reply-text').value;
    const bottleId = localStorage.getItem('currentBottleId');
    if (reply && bottleId) {
        try {
            const response = await fetch(`${apiUrl}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bottleId, reply })
            });
            const data = await response.json();
            if (data.success) {
                document.getElementById('reply-text').value = '';
                alert('回复已发送！');
            }
        } catch (error) {
            console.error('回复漂流瓶失败:', error);
        }
    }
});