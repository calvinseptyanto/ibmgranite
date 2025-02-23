import React, { createContext, useState, useContext } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  return (
    <FileContext.Provider value={{ uploadedFiles, setUploadedFiles }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => useContext(FileContext);