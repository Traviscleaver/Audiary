const app = require("./app");

const PORT = process.env.PORT || 3000;

console.log("Starting Audiary API server...");
app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on ${PORT}`));

