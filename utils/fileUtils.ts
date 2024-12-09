import { SupportedFormat } from '../types';

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const validateFileType = (file: File, supportedFormats: SupportedFormat[]): { isValid: boolean; error?: string } => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  // Check file extension and MIME type
  const supportedFormat = supportedFormats.find(
    format => 
      format.value.toLowerCase() === fileExtension || 
      format.mimeTypes.includes(file.type)
  );

  if (!supportedFormat) {
    return {
      isValid: false, 
      error: `Unsupported file type. Supported types are: ${supportedFormats.map(f => f.label).join(', ')}`
    };
  }

  // Check file size
  if (file.size > maxFileSize) {
    return {
      isValid: false, 
      error: `File is too large. Maximum file size is 50MB.`
    };
  }

  return { isValid: true };
};

export const getSupportedFormats = (): SupportedFormat[] => [
  { 
    value: 'pdf', 
    label: 'PDF', 
    mimeTypes: ['application/pdf'] 
  },
  { 
    value: 'docx', 
    label: 'Microsoft Word', 
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ] 
  },
  { 
    value: 'jpg', 
    label: 'JPEG Image', 
    mimeTypes: ['image/jpeg'] 
  },
  { 
    value: 'png', 
    label: 'PNG Image', 
    mimeTypes: ['image/png'] 
  },
  { 
    value: 'mp3', 
    label: 'Audio MP3', 
    mimeTypes: ['audio/mpeg'] 
  },
  { 
    value: 'mp4', 
    label: 'Video MP4', 
    mimeTypes: ['video/mp4'] 
  },
  { 
    value: 'txt', 
    label: 'Text File', 
    mimeTypes: ['text/plain'] 
  },
  { 
    value: 'xlsx', 
    label: 'Excel Spreadsheet', 
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ] 
  }
];