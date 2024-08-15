// public/index.js
window.addEventListener('DOMContentLoaded', (event) => {
    /*document.querySelectorAll('.user-name').forEach((elem) => {
        elem.addEventListener('click', (event) => {
            alert(event.target.innerHTML);
        });
    });
    */
    document.querySelector('.send-button').addEventListener('click', (event) => {
        const text = document.querySelector('.input-text').value;
        const text2 = document.querySelector('.input-text2').value;
        fetch('/api/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: text, amount: text2 }) })
            .then(response => {
                if (response.ok) {
                    alert('追加しました');
                }
            });
    });

    document.querySelector('.change-button').addEventListener('click', (event) => {
        const s_item = document.querySelector('select[name="c_item"]').value;
        const n_amount = document.querySelector('.input-text4').value;
        fetch('/api/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: s_item, n_amount: n_amount }) })
            .then(response => {
                if (response.ok) {
                    alert('更新しました');
                }
            });
    });

    document.querySelector('.delete-button').addEventListener('click', (event) => {
        const s_item2 = document.querySelector('select[name="d_item"]').value;
        fetch('/api/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: s_item2, amount: s_item2 }) })
            .then(response => {
                if (response.ok) {
                    alert('削除しました');
                }
            });
    });
});
