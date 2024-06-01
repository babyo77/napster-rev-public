/* eslint-disable no-useless-catch */
import { Client, Databases, Storage, Account } from "appwrite";
export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65c15bc8bfb586129eb4");

export const DATABASE_ID = "65c16b42a63bdf7ae90b";
export const PLAYLIST_COLLECTION_ID = "65d075413f130b648306";
export const ALBUM_COLLECTION_ID = "65e4ee1041c081071ca6";
export const LISTEN_NOW_COLLECTION_ID = "65d0c650c240cf202af4";
export const MOST_PLAYED = "65d0d537137bf0bb6237";
export const LIKE_SONG = "65daaf724f49c4ea1039";
export const EDITS = "6618ee6339ea5ba6ba3b";
export const FAV_ARTIST = "65e4b48e1e6c04f9d893";
export const INSIGHTS = "65d7e476ad0f598faa84";
export const ARTIST_INSIGHTS = "65d8e6554ce945db433b";
export const PLAYLIST_INSIGHTS = "65d8e65fc23147683f5b";
export const ALBUM_INSIGHTS = "65e16f879455cda020d4";
export const NEW_USER = "65d8aa90aa8c5dcaa2ce";
export const UPDATES = "65da232e478bcf5bbbad";
export const SPONSORS = "65e08a335e4df7351d5a";
export const LAST_PLAYED = "65e75b144ddb0ceccd5f";
export const ADD_TO_LIBRARY = "65f4607deb80cb8d855a";
export const BUCKET = "65f4fab3186d4eb687f6";
export const STORAGE = "65f4fab3186d4eb687f6";
export const storage = new Storage(client);
export const LYRICS = "65fb85530b93d2da4a16";
export const TUNEBOX = "6613ec4e44f69b37f90c";
export const FAV_PROFILES = "66310c2400356359f291";
export const PLAYLIST_RATING = "664792c00022f0a04fc2";
export const BROWSE_ALL = "664fc30d000b292ee09a";

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
