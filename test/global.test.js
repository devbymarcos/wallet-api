let supertest = require("supertest");

let request = supertest("http://localhost:3000");

test("run port 3000", () => {
    return request
        .get("/v1/")
        .then((res) => expect(res.statusCode).toEqual(200));
});
