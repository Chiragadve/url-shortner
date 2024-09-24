const express = require("express");
const urlRoute = require("./routes/url");
const app = express();

const PORT = 8001;

app.use("/url", urlRoute);

app.listen(8001, () => console.log(`Server Started at port: ${PORT}`));
