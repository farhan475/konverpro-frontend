'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, FloppyDisk } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';

interface SignaturePadProps {
  onSave: (blob: Blob) => void;
  isSaving?: boolean;
}

export const SignaturePad = ({ onSave, isSaving }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#031f37'; // Blue 900
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(x, y);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) onSave(blob);
      }, 'image/png');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-inner mb-6 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-[300px] cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none">
            <p className="text-gray-400 font-bold uppercase tracking-wider">Goreskan Tanda Tangan Disini</p>
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          className="flex-1 py-4 border-red/20 text-red hover:bg-red/5"
          onClick={clear}
          disabled={isEmpty || isSaving}
        >
          <Eraser size={20} weight="bold" /> Bersihkan
        </Button>
        <Button 
          className="flex-[2] py-4 bg-blue-900 text-white shadow-lg shadow-blue-900/20"
          onClick={save}
          disabled={isEmpty || isSaving}
          isLoading={isSaving}
        >
          <FloppyDisk size={20} weight="bold" /> Simpan Goresan
        </Button>
      </div>
    </div>
  );
};
