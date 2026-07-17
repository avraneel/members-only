import { Router } from "express";
import { indexController } from "../controllers/indexController.js";

export const indexRouter = new Router();

indexRouter.get("/", indexController.indexControllerGet);
indexRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
