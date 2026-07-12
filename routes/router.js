import { Router } from "express";
import { indexController } from "../controllers/indexController.js";

export const indexRouter = new Router();

indexRouter.get("/", indexController.indexControllerGet);
