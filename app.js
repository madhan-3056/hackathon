import express from 'express'; // Use import instead of require

const app = express();

// Your express setup continues...
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
