import { Client, Databases, Storage } from "appwrite";
export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("YOUR PROJECT ID");

export const DATABASE_ID = "YOUR COLLECTION ID";
export const PLAYLIST_COLLECTION_ID = "YOUR COLLECTION ID";
export const ALBUM_COLLECTION_ID = "YOUR COLLECTION ID";
export const LISTEN_NOW_COLLECTION_ID = "YOUR COLLECTION ID";
export const MOST_PLAYED = "YOUR COLLECTION ID";
export const LIKE_SONG = "YOUR COLLECTION ID";
export const EDITS = "YOUR COLLECTION ID";
export const FAV_ARTIST = "YOUR COLLECTION ID";
export const INSIGHTS = "YOUR COLLECTION ID";
export const ARTIST_INSIGHTS = "YOUR COLLECTION ID";
export const PLAYLIST_INSIGHTS = "YOUR COLLECTION ID";
export const ALBUM_INSIGHTS = "YOUR COLLECTION ID";
export const NEW_USER = "YOUR COLLECTION ID";
export const UPDATES = "YOUR COLLECTION ID";
export const SPONSORS = "YOUR COLLECTION ID";
export const LAST_PLAYED = "YOUR COLLECTION ID";
export const ADD_TO_LIBRARY = "YOUR COLLECTION ID";
export const BUCKET = "YOUR COLLECTION ID";
export const STORAGE = "YOUR COLLECTION ID";
export const storage = new Storage(client);
export const LYRICS = "YOUR COLLECTION ID";
export const TUNEBOX = "YOUR COLLECTION ID";

export const db = new Databases(client);

export { ID } from "appwrite";
