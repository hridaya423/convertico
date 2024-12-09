/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { supabase } from '../../../lib/supabase';
import { ConversionRequest, ConversionResponse } from '../../../types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConversionResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method not allowed',
      error: 'Only POST requests are supported',
    });
  }

  try {
    const { file, targetFormat }: ConversionRequest = req.body;

    // Step 1: Start conversion job
    const startConversionResponse = await axios.post(
      'https://api.convertio.co/convert/start', 
      {
        apikey: process.env.CONVERTIO_API_KEY,
        input: 'base64',
        file: file,
        outputformat: targetFormat
      }
    );

    const { id } = startConversionResponse.data;

    // Step 2: Check conversion status
    let conversionStatus;
    do {
      const statusResponse = await axios.get(`https://api.convertio.co/convert/${id}`);
      conversionStatus = statusResponse.data.status;
      
      if (conversionStatus === 'error') {
        throw new Error('Conversion failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
    } while (conversionStatus !== 'finished');

    // Step 3: Get download URL
    const downloadResponse = await axios.get(`https://api.convertio.co/convert/${id}/dl`);
    const convertedFileUrl = downloadResponse.data.url;

    // Step 4: Download the converted file
    const convertedFileResponse = await axios.get(convertedFileUrl, {
      responseType: 'arraybuffer',
    });

    // Step 5: Upload to Supabase Storage
    const fileName = `converted-${Date.now()}.${targetFormat}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('converted-files')
      .upload(fileName, convertedFileResponse.data, {
        contentType: `application/${targetFormat}`,
      });

    if (uploadError) throw uploadError;

    // Step 6: Generate public URL
    const { data: { publicUrl } } = supabase.storage
      .from('converted-files')
      .getPublicUrl(fileName);

    // Step 7: Respond with converted file URL
    res.status(200).json({
      message: 'Conversion successful',
      fileUrl: publicUrl,
    });
  } catch (error: any) {
    console.error('Error during file conversion:', error.message);

    res.status(500).json({
      message: 'Conversion failed',
      error: error.message,
    });
  }
}