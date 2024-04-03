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

    return {
        user,
        token: response.data.data.token,
    }
}

describe("/User",  () => {
    describe("GET /me",  () => {
        it("should get the current user", async () => {
            const {user, token} = await registerUser();
            const response = await API.get("/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            expect(response.status).toBe(200);
            expect(response.data.data.email).toBe(user.email);
            expect(response.data.data.firstName).toBe(user.firstName);
            expect(response.data.data.lastName).toBe(user.lastName);
        });
        it("should not get the current user without a token", async () => {
            let err = false;
            try {
                const response = await API.get("/user/me");
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        })
        it("should not get the current user with an invalid token", async () => {
            let err = false;
            try {
                const response = await API.get("/user/me", {
                    headers: {
                        Authorization: `Bearer ${randomstring(100)}`,
                    },
                });
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        })
    });
    describe("PUT /edit",  () => {
        it("should edit the current user", async () => {
            const {user, token} = await registerUser();
            const newUser = generateRandomUser();
            const response = await API.put("/user/edit", newUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            expect(response.status).toBe(200);
            expect(response.data.data.email).toBe(newUser.email);
            expect(response.data.data.firstName).toBe(newUser.firstName);
            expect(response.data.data.lastName).toBe(newUser.lastName);

            const response2 = await API.get("/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            expect(response2.status).toBe(200);
            expect(response2.data.data.email).toBe(newUser.email);
            expect(response2.data.data.firstName).toBe(newUser.firstName);
            expect(response2.data.data.lastName).toBe(newUser.lastName);
        });
        it("should not edit the current user with a wrong email", async () => {
            const {user, token} = await registerUser();
            let err = false;
            try {
                const response = await API.put("/user/edit", {
                    ...user,
                    email: "invalidemail",
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error: any) {
                err = true;
                expect(error.response.status).toBe(400);
            }
            expect(err).toBe(true);
        });
        it("should not edit the current user without a token", async () => {
            let err = false;
            try {
                const response = await API.put("/user/edit", generateRandomUser());
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        })
        it("should not edit the current user with an invalid token", async () => {
            let err = false;
            try {
                const response = await API.put("/user/edit", generateRandomUser(), {
                    headers: {
                        Authorization: `Bearer ${randomstring(100)}`,
                    },
                });
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        })
    });
    describe("DELETE /remove",  () => {
        it("should remove the current user", async () => {
            const {user, token} = await registerUser();
            const response = await API.delete("/user/remove", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            expect(response.status).toBe(200);
            expect(response.data.data.email).toBe(user.email);
            expect(response.data.data.firstName).toBe(user.firstName);
            expect(response.data.data.lastName).toBe(user.lastName);

            let err = false;
            try {
                const response2 = await API.get("/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        });
        it("should not remove the current user without a token", async () => {
            let err = false;
            try {
                const response = await API.delete("/user/remove");
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        })
        it("should not remove the current user with an invalid token", async () => {
            let err = false;
            try {
                const response = await API.delete("/user/remove", {
                    headers: {
                        Authorization: `Bearer ${randomstring(100)}`,
                    },
                });
            } catch (error: any) {
                err = true;
            }
            expect(err).toBe(true);
        })
    });
});