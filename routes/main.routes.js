import { Router } from "express";
import {
  mainFile,
  retrieveText,
  sendText,
  getMessageJson,
} from "../controllers/main.controller.js";

const routes = Router();

routes.get("/", mainFile);
routes.post("/send", sendText);
routes.get("/message/:id", retrieveText);
routes.get("/api/message/:id", getMessageJson);


export default routes;
