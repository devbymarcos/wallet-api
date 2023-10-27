import { app } from "./app.ts";

app.listen(process.env.PORT, () => {
    console.log("rodando porta :" + process.env.PORT);
});
