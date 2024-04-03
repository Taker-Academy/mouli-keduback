import { describe, it, expect } from "@jest/globals";
import { API, setToken, randomstring, generateRandomUser } from "./config";


const registerUser = async () => {
    const user = generateRandomUser();
    const response = await API.post("/auth/register", user);
    expect(response.status).toBe(201);
    expect(response.data.data).toHaveProperty("token");
    expect(response.data.data).toHaveProperty("user");
    expect(response.data.data.user.email).toBe(user.email);
    expect(response.data.data.user.firstName).toBe(user.firstName);
    expect(response.data.data.user.lastName).toBe(user.lastName);

    setToken(API, response.data.data.token);
    return {
        user,
        token: response.data.data.token,
    }
}

describe("/Auth",  () => {
    describe("POST /register",  () => {
        it("should register a new user", async () => {
            await registerUser();
        });
        it("should not register a user without a field", async () => {
            const randomUser = generateRandomUser();
            let err = false;
            try {
                const response = await API.post("/auth/register", {
                    email: randomUser.email,
                    password: randomUser.password,
                    firstName: randomUser.firstName,
                });
                }
            catch (error: any) {
                err = true;
                expect(error.response.status).toBe(400);
            }
            expect(err).toBe(true);
        });
        it("should not register a user with the same email", async () => {
            const {user} = await registerUser();
            let err = false;
            try {

                const response = await API.post("/auth/register", {
                    ...user,
                    email: user.email,
                });
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        })
        it("should not register a user with an invalid email", async () => {
            let err = false;
            try {
                const response = await API.post("/auth/register", {
                    email: "invalidemail",
                    password: "test1234",
                    firstName: "test",
                    lastName: "test",
                });
            } catch (error: any) {
                err = true;
                expect(error.response.status).toBe(400);
            }
            expect(err).toBe(true);
        });
    });
    describe("POST /login",  () => {
        it("should login a user", async () => {
            const {user} = await registerUser();
            const response = await API.post("/auth/login", {
                email: user.email,
                password: user.password,
            });
            expect(response.status).toBe(200);
            expect(response.data.data).toHaveProperty("token");
            expect(response.data.data).toHaveProperty("user");
            expect(response.data.data.user.email).toBe(user.email);
            expect(response.data.data.user.firstName).toBe(user.firstName);
            expect(response.data.data.user.lastName).toBe(user.lastName);
        });
        it("should not login a user with the wrong password", async () => {
            let err = false;
            try {
                const response = await API.post("/auth/login", {
                    email: randomstring(10) + "@test.com",
                    password: "wrongpassword",
                });
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        });
    });
});