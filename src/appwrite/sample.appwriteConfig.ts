import { Client, Databases } from "appwrite";
export const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject("YOUR PROJECT");

export const DATABASE_ID = "YOUR ID";
export const PLAYLIST_COLLECTION_ID = "YOUR ID";
export const LISTEN_NOW_COLLECTION_ID = "YOUR ID";
export const TRENDING_COLLECTION_ID = "YOUR ID";
export const LIKE_SONG = "";
export const INSIGHTS = "";
export const ARTIST_INSIGHTS = "YOUR ID";
export const PLAYLIST_INSIGHTS = "YOUR ID";
export const NEW_USER = "YOUR ID";

export const db = new Databases(client);

export { ID } from "appwrite";
