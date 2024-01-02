import { app } from "./app";

app.listen(process.env.PORT, () => {
    console.log("rodando porta :" + process.env.PORT);
});
