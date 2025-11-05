import app from "../server.js";
import { createServer } from "http";

const server = createServer(app);

export default function handler(req, res) {
  return server.emit("request", req, res);
}
