import { test, expect, describe } from "vitest";
import { app } from "../../app";
import request from "supertest";

describe("GET /user", () => {
    test("Espero ter um usuario para o email", async () => {
        const response = await request(app)
            .get("/v1/user")
            .send({ email: "marcoslopes.dev@gmail.com" });
        expect(response.status).toBe(200);
    });
});
