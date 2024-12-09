import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      {
        message: 'Method not allowed',
        error: 'Only POST requests are supported',
      },
      { status: 405 }
    );
  }

  try {
    const { file, targetFormat } = await req.json();

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
    return NextResponse.json({
      message: 'Conversion successful',
      fileUrl: publicUrl,
    });
  } catch (error: any) {
    console.error('Error during file conversion:', error.message);
    return NextResponse.json(
      {
        message: 'Conversion failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
