import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:8000";

export const API = axios.create({
    baseURL: API_URL,
});

export const randomstring = (length: number) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export const setToken = (PP: any, token: string) => {
    PP.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}


export const generateRandomUser = () => {
    return {
        email: `test${Math.random()}@test.com`,
        password:
            "test1234",
        firstName: randomstring(10),
        lastName: randomstring(10),
    };
}

export const generateRandomPost = () => {
    return {
        title: randomstring(10),
        content: randomstring(100),
    }
}