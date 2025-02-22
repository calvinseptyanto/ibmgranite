import React from 'react';
import PropTypes from 'prop-types';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

const DocumentUpload = ({ onFileUpload, uploadedFiles }) => {
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    onFileUpload?.(files);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.txt"
        />
        <label
          htmlFor="file-upload"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
        >
          <Upload size={20} />
          Upload Documents
        </label>
        <div className="text-sm text-gray-500">
          {uploadedFiles.length} files uploaded
        </div>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
          <ul className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
DocumentUpload.propTypes = {
  onFileUpload: PropTypes.func,
  uploadedFiles: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  })).isRequired
};

export default DocumentUpload;