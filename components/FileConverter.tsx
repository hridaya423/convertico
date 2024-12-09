/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { 
  convertToBase64, 
  getSupportedFormats,
  validateFileType 
} from '../utils/fileUtils';
import { ConversionResponse, SupportedFormat } from '../types';
import { Upload, FileText, Layers } from 'lucide-react';

const FileConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('pdf');
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supportedFormats = getSupportedFormats();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const validationResult = validateFileType(uploadedFile, supportedFormats);
      
      if (validationResult.isValid) {
        setFile(uploadedFile);
        setError(null);
      } else {
        setFile(null);
        setError(validationResult.error || 'Invalid file type');
      }
    }
  };

  const convertFile = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setConvertedFileUrl(null);

    try {
      // Convert file to base64
      const base64File = await convertToBase64(file);

      const response = await axios.post<ConversionResponse>('/api/convert', {
        file: base64File,
        targetFormat
      });

      if (response.data.fileUrl) {
        setConvertedFileUrl(response.data.fileUrl);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ConversionResponse>;
      setError(
        axiosError.response?.data.error || 
        'An unexpected error occurred during conversion'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-2xl rounded-3xl border-4 border-white relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
    
    <div className="flex items-center mb-6">
      <Layers className="w-10 h-10 mr-4 text-purple-600" />
      <h1 className="text-4xl font-black text-indigo-900 tracking-tight">
        File Converter
      </h1>
    </div>

    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-purple-100 shadow-inner">
      <div 
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all 
          ${file 
            ? 'border-purple-300 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-300'}`}
      >
        <input 
          type="file" 
          onChange={handleFileUpload}
          className="hidden"
          id="fileUpload"
          accept=".pdf,.docx,.jpg,.png"
        />
        <label 
          htmlFor="fileUpload" 
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-purple-500 mb-4" />
          {file ? (
            <div>
              <FileText className="inline-block mr-2 text-purple-600" />
              <span className="text-purple-800">{file.name}</span>
            </div>
          ) : (
            <p className="text-gray-600">
              Drag and drop or click to upload file
            </p>
          )}
        </label>
      </div>

      <select 
        value={targetFormat}
        onChange={(e) => setTargetFormat(e.target.value)}
        className="w-full p-3 mt-4 rounded-lg border border-purple-200 bg-white text-indigo-900"
      >
        {supportedFormats.map((format) => (
          <option key={format.value} value={format.value}>
            Convert to {format.label}
          </option>
        ))}
      </select>

      <button 
        onClick={convertFile}
        disabled={!file || isLoading}
        className={`w-full mt-4 p-3 rounded-lg text-white font-bold transition-all 
          ${file && !isLoading 
            ? 'bg-purple-600 hover:bg-purple-700' 
            : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {isLoading ? 'Converting...' : 'Convert File'}
      </button>

      {convertedFileUrl && (
        <div className="mt-4 text-center">
          <a 
            href={convertedFileUrl} 
            className="text-purple-600 hover:underline flex items-center justify-center"
          >
            <Layers className="mr-2" /> Download Converted File
          </a>
        </div>
      )}
    </div>
  </div>
  );
};

export default FileConverter;