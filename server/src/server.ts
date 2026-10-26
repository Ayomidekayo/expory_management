
import { createServer } from "node:http";
import app from "./app";
import { env } from "./config/env";
import { initializeSocket } from "./realtime/socket";

const server = createServer(app);

initializeSocket(server);

server.listen(Number(env.PORT), () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`);
});
