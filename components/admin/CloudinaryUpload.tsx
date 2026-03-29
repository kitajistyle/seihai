'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloudinary: any;
  }
}

export default function CloudinaryUpload({ onUploadSuccess, folder = 'seihai' }: CloudinaryUploadProps) {
  const [isReady, setIsReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (window.cloudinary) setIsReady(true);
  }, []);

  const handleUpload = () => {
    if (!isReady || !window.cloudinary) return;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary の設定（Cloud Name or Upload Preset）が .env.local に見つかりません。');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        folder,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: true,
        showSkipCropButton: false,
        croppingAspectRatio: 1, // Require square for players, maybe 16/9 for others?
        clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
        maxFileSize: 2000000, // 2MB
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          onUploadSuccess(result.info.secure_url);
          setIsUploading(false);
        } else if (error) {
          setIsUploading(false);
          console.error('Upload Error:', error);
        }
      }
    );

    setIsUploading(true);
    widget.open();
  };

  return (
    <>
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        onLoad={() => setIsReady(true)}
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={!isReady || isUploading}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        ) : (
          <ImageIcon className="w-4 h-4 text-blue-500" />
        )}
        <span>画像をアップロード</span>
      </button>
    </>
  );
}
