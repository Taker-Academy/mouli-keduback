import { describe, it, expect, beforeAll } from "@jest/globals";
import { API, generateRandomUser, generateRandomPost } from "./config";


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
    id: response.data.data.user.id
  }
}

const pushComment = async ( token: string, postId: string) => {

    const comment = {
        content: "This is a comment",
    };
    const response = await API.post(`/comment/${postId}`, comment, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
}

const expectDateToBeCloseToNow = (date: string) => {
    const now = new Date();
    const createdAt = new Date(date);
    expect(now.getTime() - createdAt.getTime()).toBeLessThan(1000);
    }

const pushPost = async () => {
  const post = generateRandomPost();
    const { token, id } = await registerUser();

  const response = await API.post("/post", post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expect(response.status).toBe(201);
  expect(response.data.data.title).toBe(post.title);
  expect(response.data.data.content).toBe(post.content);
  expect(response.data.data.upVotes).toEqual([]);
  expect(response.data.data.comments).toEqual([]);

  return {
    post,
    postResponse: response.data.data,
    id
  }
}
describe("/comment  ", () => {
  describe("POST /", () => {
    it("should create a new comment", async () => {
      const { token, user } = await registerUser();
      const { postResponse } = await pushPost();

        const comment = {
            content: "This is a comment",
        };
        const response = await API.post(`/comment/${postResponse._id}`, comment, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(response.status).toBe(201);
        expect(response.data.data.content).toBe(comment.content);
        expect(response.data.data.firstName).toBe(user.firstName);
        expectDateToBeCloseToNow(response.data.data.createdAt);
    });
    it("should not create a comment without a token", async () => {
        let err = false;
        const { postResponse } = await pushPost();
        const comment = {
            content: "This is a comment",
        };
        try {
            const response = await API.post(`/comment/${postResponse._id}`, comment);
        } catch (error: any) {
            err = true;
        }
        expect(err).toBe(true);
    });
    it("should not create a comment without content", async () => {
        let err = false;
        const { token } = await registerUser();
        const { postResponse } = await pushPost();
        const comment = {
            content: "",
        };
        try {
            const response = await API.post(`/comment/${postResponse._id}`, comment, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error: any) {
            err = true;
        }
        expect(err).toBe(true);
    });
    it("Create comment and get it in post", async () => {
        const { token, user } = await registerUser();
        const { postResponse } = await pushPost();

        const comment = {
            content: "This is a comment",
        };

        const response = await API.post(`/comment/${postResponse._id}`, comment, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(response.status).toBe(201);
        expect(response.data.data.content).toBe(comment.content);
        expect(response.data.data.firstName).toBe(user.firstName);
        expectDateToBeCloseToNow(response.data.data.createdAt);

        const post = await API.get(`/post/${postResponse._id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(post.data.data.comments.length).toBe(1);
        expect(post.data.data.comments[0].content).toBe(comment.content);
        expect(post.data.data.comments[0].firstName).toBe(user.firstName);
        expectDateToBeCloseToNow(post.data.data.comments[0].createdAt);
    });
    it("Stress test API comments", async () => {
        const randomComment = Math.floor(Math.random() * 100);
        const { token } = await registerUser();
        const { postResponse } = await pushPost();

        for (let i = 0; i < randomComment; i++) {
            await pushComment(token, postResponse._id);
        }

        const post = await API.get(`/post/${postResponse._id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(post.data.data.comments.length).toBe(randomComment);
    });
  });

});