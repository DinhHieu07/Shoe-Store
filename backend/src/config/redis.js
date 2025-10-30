require('dotenv').config();
const { createClient } = require("redis");

const clientRedis = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

clientRedis.on("error", (err) => console.error("Redis Error:", err));

const connectRedis = async () => {
  try {
    await clientRedis.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Redis connection error:", error);
    process.exit(1);
  }
};

module.exports = {
  clientRedis,
  connectRedis
};