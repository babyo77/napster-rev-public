/* eslint-disable no-useless-catch */
import { Client, Databases, Storage, Account } from "appwrite";
export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_PROJECT_ID);

export const DATABASE_ID = import.meta.env.DATABASE_ID;
export const PLAYLIST_COLLECTION_ID = import.meta.env.PLAYLIST_COLLECTION_ID;
export const ALBUM_COLLECTION_ID = import.meta.env.ALBUM_COLLECTION_ID;
export const LISTEN_NOW_COLLECTION_ID = import.meta.env
  .LISTEN_NOW_COLLECTION_ID;
export const MOST_PLAYED = import.meta.env.MOST_PLAYED;
export const LIKE_SONG = import.meta.env.LIKE_SONG;
export const EDITS = import.meta.env.EDITS;
export const FAV_ARTIST = import.meta.env.FAV_ARTIST;
export const INSIGHTS = import.meta.env.INSIGHTS;
export const ARTIST_INSIGHTS = import.meta.env.ARTIST_INSIGHTS;
export const PLAYLIST_INSIGHTS = import.meta.env.PLAYLIST_INSIGHTS;
export const ALBUM_INSIGHTS = import.meta.env.ALBUM_INSIGHTS;
export const NEW_USER = import.meta.env.NEW_USER;
export const UPDATES = import.meta.env.UPDATES;
export const SPONSORS = import.meta.env.SPONSORS;
export const LAST_PLAYED = import.meta.env.LAST_PLAYED;
export const ADD_TO_LIBRARY = import.meta.env.ADD_TO_LIBRARY;
export const BUCKET = import.meta.env.BUCKET;
export const STORAGE = import.meta.env.STORAGE;
export const storage = new Storage(client);
export const LYRICS = import.meta.env.LYRICS;
export const TUNEBOX = import.meta.env.TUNEBOX;
export const FAV_PROFILES = import.meta.env.FAV_PROFILES;
export const PLAYLIST_RATING = import.meta.env.PLAYLIST_RATING;
export const BROWSE_ALL = import.meta.env.BROWSE_ALL;

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
      throw error;
    }
  }
  async isUserLoggedIn() {
    try {
      const account = await this.account.get();

      if (account) {
        localStorage.setItem("n", account.name);
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
      console.log("error getting" + error);

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
