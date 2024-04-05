import { Client, Databases } from "appwrite";
export const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject("YOUR PROJECT");

export const DATABASE_ID = "YOUR ID";
export const PLAYLIST_COLLECTION_ID = "YOUR ID";
export const ALBUM_COLLECTION_ID = "YOUR ID";
export const LISTEN_NOW_COLLECTION_ID = "YOUR ID";
export const MOST_PLAYED = "YOUR ID";
export const LIKE_SONG = "YOUR ID";
export const FAV_ARTIST = "YOUR ID";
export const INSIGHTS = "YOUR ID";
export const ARTIST_INSIGHTS = "YOUR ID";
export const PLAYLIST_INSIGHTS = "YOUR ID";
export const ALBUM_INSIGHTS = "YOUR ID";
export const NEW_USER = "YOUR ID";
export const UPDATES = "YOUR ID";
export const SPONSORS = "YOUR ID";
export const LAST_PLAYED = "YOUR ID";
export const ADD_TO_LIBRARY = "YOUR ID";
export const BUCKET = "YOUR ID";
export const STORAGE = "YOUR ID";
export const storage = new Storage(client);
export const LYRICS = "YOUR ID";
export const db = new Databases(client);

export { ID } from "appwrite";
