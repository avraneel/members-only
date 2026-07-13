import { Router } from "express";
import { signupController } from "../controllers/signupController.js";

export const signupRouter = Router();

signupRouter.get("/", signupController.signupControllerGet);
signupRouter.post("/", signupController.signupControllerPost);
