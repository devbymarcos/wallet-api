import { test, expect, describe } from "vitest";
import { app } from "../../app";
import request from "supertest";

describe("GET /user", () => {
    test("Espero ter um usuario para o token", async () => {
        const response = await request(app)
            .get("/v1/user")
            .set("Authorization", `Bearer ${process.env.TOKEN_TEST_LOGIN}`);
        expect(response.body.data).toHaveProperty("id");
    });

    test("Não deve ser possivel buscar usuário sem o token", async () => {
        const response = await request(app).get("/v1/user");
        expect(response.status).toBe(401);
    });
});
