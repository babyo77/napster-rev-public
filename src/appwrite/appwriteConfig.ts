/* eslint-disable no-useless-catch */
import { Client, Databases, Storage, Account } from "appwrite";
export const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject("");

export const DATABASE_ID = "";
export const PLAYLIST_COLLECTION_ID = "";
export const ALBUM_COLLECTION_ID = "";
export const LISTEN_NOW_COLLECTION_ID = "";
export const MOST_PLAYED = "";
export const LIKE_SONG = "";
export const EDITS = "";
export const FAV_ARTIST = "";
export const INSIGHTS = "";
export const ARTIST_INSIGHTS = "";
export const PLAYLIST_INSIGHTS = "";
export const ALBUM_INSIGHTS = "";
export const NEW_USER = "";
export const UPDATES = "";
export const SPONSORS = "";
export const LAST_PLAYED = "";
export const ADD_TO_LIBRARY = "";
export const BUCKET = "";
export const STORAGE = "";
export const storage = new Storage(client);
export const LYRICS = "";
export const TUNEBOX = "";
export const FAV_PROFILES = "";

export const db = new Databases(client);

export class AuthService {
  client = client;
  account;
  constructor() {
    this.client;
    this.account = new Account(this.client);
  }

  async createAccount(uid: string, email: string, password: string) {
    try {
      const userAccount = await this.login(email, password);
      if (userAccount) {
        return true;
      }
    } catch (error) {
      if (
        //@ts-expect-error:appwrite response on error
        error.message ===
        "Invalid credentials. Please check the email and password."
      ) {
        const account = await this.account.create(uid, email, password);
        if (account) {
          await this.login(email, password);
          return true;
        }
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      await this.account.createEmailSession(email, password);
      return true;
    } catch (error) {
      //@ts-expect-error:appwrite exception
      if (error.type === "user_session_already_exists") {
        await this.logout("current");
        await this.login(email, password);
        window.location.reload();
      }
      throw error;
    }
  }
  async isUserLoggedIn() {
    try {
      const account = await this.account.get();

      if (account) {
        localStorage.setItem("uid", account.$id);
        localStorage.setItem("em", account.email);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getAccount() {
    try {
      return await this.account.get();
    } catch (error) {
      throw error;
    }
  }

  async getSession() {
    try {
      return await this.account.listSessions();
    } catch (error) {
      throw error;
    }
  }
  async logout(session: string) {
    try {
      await this.account.deleteSession(session);
    } catch (error) {
      throw error;
    }
  }
  async updateName(name: string) {
    try {
      await this.account.updateName(name);
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;

export { ID } from "appwrite";
