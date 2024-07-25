const express = require("express");
const config = require("config");
const mainRouter = require("./router/index.routes");

const PORT = config.get("port");

const app = express();
app.use(express.json());

app.use("/api", mainRouter);


//  ichida await yozishimiz munkin shuning  uchun async
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  }catch (error) {}
}

start();
