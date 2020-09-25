const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});