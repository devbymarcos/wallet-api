import { test, expect, describe } from "vitest";
import { app } from "../app";
import request from "supertest";

describe("GET /v1/", () => {
    test("Rodar an porta 3000", () => {
        return request(app).get("/v1/").expect(200);
    });
});
