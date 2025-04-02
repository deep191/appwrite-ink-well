
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

export const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id';
export const APPWRITE_DATABASE_ID = 'blog-database';
export const APPWRITE_COLLECTION_POSTS = 'posts';
export const APPWRITE_COLLECTION_USERS = 'users';
export const APPWRITE_BUCKET_ID = 'blog-images';

// Initialize the Appwrite client
export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Authentication helpers
export const createAccount = async (email: string, password: string, name: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    
    // Create user profile
    if (newAccount) {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_USERS,
        ID.unique(),
        {
          userId: newAccount.$id,
          name: name,
          email: email,
          bio: '',
        }
      );
    }
    
    return await login(email, password);
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    return await account.createEmailSession(email, password);
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    return await account.deleteSessions();
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const users = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_USERS,
      [Query.equal('userId', userId)]
    );
    
    return users.documents[0];
  } catch (error) {
    throw error;
  }
};

// Blog post helpers
export const getPosts = async (limit = 10) => {
  try {
    const posts = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_POSTS,
      [Query.orderDesc('$createdAt'), Query.limit(limit)]
    );
    
    return posts.documents;
  } catch (error) {
    throw error;
  }
};

export const getPost = async (postId: string) => {
  try {
    return await databases.getDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_POSTS,
      postId
    );
  } catch (error) {
    throw error;
  }
};

export const createPost = async (
  title: string,
  content: string,
  authorId: string,
  authorName: string,
  imageId?: string
) => {
  try {
    return await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_POSTS,
      ID.unique(),
      {
        title,
        content,
        authorId,
        authorName,
        imageId,
        published: true,
      }
    );
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (
  postId: string,
  data: {
    title?: string;
    content?: string;
    imageId?: string;
    published?: boolean;
  }
) => {
  try {
    return await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_POSTS,
      postId,
      data
    );
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    return await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_POSTS,
      postId
    );
  } catch (error) {
    throw error;
  }
};

// File storage helpers
export const uploadImage = async (file: File) => {
  try {
    return await storage.createFile(
      APPWRITE_BUCKET_ID,
      ID.unique(),
      file
    );
  } catch (error) {
    throw error;
  }
};

export const getFilePreview = (fileId: string) => {
  return storage.getFilePreview(APPWRITE_BUCKET_ID, fileId);
};
