import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

export const documentService = {
  async uploadDocument(file, dashboardId = null) {
    try {
      // Generate a unique path for the file
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create a new dashboard ID if none provided
      const documentDashboardId = dashboardId || uuidv4();

      // Store file metadata in the documents table
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          dashboard_id: documentDashboardId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          metadata: {}
        })
        .select()
        .single();

      if (documentError) throw documentError;

      return {
        document: documentData,
        dashboardId: documentDashboardId
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  async getDocumentsByDashboardId(dashboardId) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('dashboard_id', dashboardId);

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  async deleteDocument(documentId) {
    try {
      const { data: document } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (document) {
        // Extract file path from URL
        const filePath = document.file_url.split('/').pop();
        
        // Delete from storage
        await supabase.storage
          .from('documents')
          .remove([`documents/${filePath}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};