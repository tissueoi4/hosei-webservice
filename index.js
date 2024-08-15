const express = require('express');
const app = express();
const path = require('node:path');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

app.set('view engine', 'ejs');
// publicディレクトリ以下のファイルを静的ファイルとして配信
app.use('/static', express.static(path.join(__dirname, 'public')));

const logMiddleware = (req, res, next) => {
    console.log(req.method, req.path);
    next();
}

app.get('/user/:id', logMiddleware, (req, res) => {
    // :idをreq.params.idとして受け取る
    res.status(200).send(req.params.id);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

async function main() {
    await client.connect();

    const db = client.db('my-app');

    app.get('/', logMiddleware, async (req, res) => {
        // const users = ['alpha', 'beta', 'gamma'];
        const users = await db.collection('user').find().toArray();
        // console.log(users);
        const userdatas = users.map((user) => ({
            name: user.name, amount: user.amount
        }));

        res.render(path.resolve(__dirname, 'views/index.ejs'), { users: userdatas });
    });

    app.post('/api/user', express.json(), async (req, res) => {
        const name = req.body.name;
        // console.log(name);
        const amount = req.body.amount;
        // console.log(amount);
        if (!name || !amount) {
            res.status(400).send('Bad Request');
            return;
        }
        await db.collection('user').insertOne({ name: name, amount: amount });
        res.status(200).send('Created');
    });

    app.post('/api/update', express.json(), async (req, res) => {
        const name = req.body.name;
        const n_amount = req.body.n_amount;
        if (!name || !n_amount) {
            res.status(400).send('Bad Request');
            return;
        }
        await db.collection('user').updateOne({ name: name }, { $set: { amount: n_amount } });
        res.status(200).send('Updated');
    });

    app.post('/api/delete', express.json(), async (req, res) => {
        const name = req.body.name;
        if (!name) {
            res.status(400).send('Bad Request');
            return;
        }
        await db.collection('user').deleteOne({ name: name });
        res.status(200).send('Deleted');
    });

    // ポート: 3000でサーバーを起動
    app.listen(3000, () => {
        // サーバー起動後に呼び出されるCallback
        console.log('start listening');
    });
}
main();