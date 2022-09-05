import express from "express";

export const router = express.Router();

export function startServer(port) {
    const app = express();
    app.use("/", router);
    app.listen(port);
    return router;
};
