import { describe, it, expect, beforeAll } from "@jest/globals";
import { API, setToken, generateRandomUser, generateRandomPost } from "./config";


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

const pushPost = async (token: string) => {
  const post = generateRandomPost();
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
  }
}
describe("/Post", () => {
  describe("POST /", () => {


    it("should create a new post", async () => {
      const { token } = await registerUser();
      const post = generateRandomPost();

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
    });
    it("should not create a post without a token", async () => {
      let err = false;
      const post = generateRandomPost();

      try {
        const response = await API.post("/post", post);
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    })
    it("should not create a post without a title", async () => {
      let err = false;
      const { token } = await registerUser();

      try {
        const response = await API.post("/post", {
          content: "zfzfzefzfezf"
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    })
  });
  describe("GET /", () => {
    it("should get all posts", async () => {
      const { token } = await registerUser();
      const post = generateRandomPost();

      const response = await API.post("/post", post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response2 = await API.get("/post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response2.status).toBe(200);
      expect(response2.data.data.length).toBeGreaterThan(0);

      let found = false;

      for (let p of response2.data.data) {
        if (p.title === post.title) {
          found = true;
        }
      }
      expect(found).toBe(true);
    });
  });
  describe("GET /:id", () => {
    it("should get a post by id", async () => {
      const { token } = await registerUser();
      const post = generateRandomPost();

      const response = await API.post("/post", post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response2 = await API.get(`/post/${response.data.data._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response2.status).toBe(200);
      expect(response2.data.data.title).toBe(post.title);
      expect(response2.data.data.content).toBe(post.content);
    });
    it("should not get a post by id with a wrong id", async () => {
      let err = false;
      const { token } = await registerUser();

      try {
        const response2 = await API.get(`/post/660d6647cc0065d54mbd1c2a`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    });
    it("should not get a post by id without a token", async () => {
      let err = false;
      const post = generateRandomPost();

      try {
        const response = await API.post("/post", post);
        const response2 = await API.get(`/post/${response.data.data._id}`);
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    });
  });
  describe("DELETE /:id", () => {

    it("should delete a post by id", async () => {
      const { token } = await registerUser();
      const post = generateRandomPost();

      const response = await API.post("/post", post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response2 = await API.delete(`/post/${response.data.data._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response2.status).toBe(200);

      let err = false;
      try {
        const response3 = await API.get(`/post/${response.data.data._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    });
    it("should not delete a post by id with a wrong id", async () => {
      let err = false;
      const { token } = await registerUser();

      try {
        const response2 = await API.delete(`/post/660d6647cc0065d54mbd1c2a`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    });
    it("Should not delete other user's post", async () => {
      let err = false;
      const { token } = await registerUser();
      const { token: token2 } = await registerUser();
      const post = generateRandomPost();

      const response = await API.post("/post", post, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response2 = await API.delete(`/post/${response.data.data._id}`, {
          headers: {
            Authorization: `Bearer ${token2}`,
          },
        });
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    });
    it("should not delete a post by id without a token", async () => {
      let err = false;
      const post = generateRandomPost();

      try {
        const response = await API.post("/post", post);
        const response2 = await API.delete(`/post/${response.data.data._id}`);
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    });
  });
  describe("POST /vote/:id", () => {
    it("should upvote a post by id", async () => {
      const { token, id } = await registerUser();
      const post = await pushPost(token);

      const response = await API.post(`/post/vote/${post.postResponse._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        ok: true,
        message: "post upvoted"
      })

      const response2 = await API.get(`/post/${post.postResponse._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response2.status).toBe(200);
      expect(response2.data.data.upVotes.length).toBe(1);
      expect(response2.data.data.upVotes[0]).toBe(id);
    });
    it("should not upvote a post by id with a wrong id", async () => {
      let err = false;
      const { token } = await registerUser();

      try {
        const response = await API.post(`/post/vote/660d6647cc0065d54mbd1c2a`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    });
    it("should not upvote a post by id without a token", async () => {
      let err = false;
      const { token } = await registerUser();

      const post = await pushPost(token);

      try {
        const response = await API.post(`/post/vote/${post.postResponse._id}`, {});
      } catch (error: any) {
        err = true;
      }
      expect(err).toBe(true);
    })
    it("should not upvote a post by id twice", async () => {
      let err = false;
      const { token } = await registerUser();
      const post = await pushPost(token);

      try {
        const response = await API.post(`/post/vote/${post.postResponse._id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error: any) {
      }
      expect(err).toBe(false);

      try  {
        const response2 = await API.post(`/post/vote/${post.postResponse._id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        err = true;
        expect(error.response.status).toBe(403);
      }
      expect(err).toBe(true);
    });
  });
});