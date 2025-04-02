
import { supabase } from "@/integrations/supabase/client";

// Authentication helpers
export const createAccount = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.log('Not currently logged in');
    return null;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Blog post helpers
export const getPosts = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const getPost = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error getting post:', error);
    throw error;
  }
};

export const createPost = async (
  title: string,
  content: string,
  authorId: string,
  authorName: string,
  imageUrl?: string
) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title,
        content,
        author_id: authorId,
        author_name: authorName,
        image_url: imageUrl,
        published: true,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (
  postId: string,
  data: {
    title?: string;
    content?: string;
    image_url?: string;
    published?: boolean;
  }
) => {
  try {
    const { data: updatedPost, error } = await supabase
      .from('posts')
      .update(data)
      .eq('id', postId)
      .select()
      .single();
    
    if (error) throw error;
    return updatedPost;
  } catch (error: any) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// File storage helpers
export const uploadImage = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getImageUrl = (path: string) => {
  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(path);
  
  return data.publicUrl;
};
