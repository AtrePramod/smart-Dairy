const app = require("./App");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
