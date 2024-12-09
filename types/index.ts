export interface SupportedFormat {
    value: string;
    label: string;
    mimeTypes: string[];
  }
  
  export interface ConversionRequest {
    file: string;
    targetFormat: string;
  }
  
  export interface ConversionResponse {
    message?: string;
    fileUrl?: string;
    error?: string;
  }
  
  export interface CloudConvertTask {
    name: string;
    result: {
      files: Array<{
        url: string;
      }>;
    };
  }