import React, { useState, useRef } from 'react';
import { useMotionTemplate, useMotionValue, motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { ImageUp, XCircleIcon } from 'lucide-react';
import StyledText from '../Elements/StyledText';
import toast from 'react-hot-toast';
import StyledInput from '../Elements/StyledInput';

interface ImageInputDisplayProps {
  allowDnd?: boolean;
  src?: string | null;
  maxSize?: number;
  className?: string;
  onChange?: (file: File) => void;
  onDelete?: () => void;
  disabled?: boolean;
  placeholder?: {
    text: string;
    classNames: string;
    iconSize?: number;
  };
}

const ImageInputDisplay = ({
  allowDnd = true,
  maxSize = 3 * 1024 * 1024,
  className,
  onChange,
  src,
  onDelete,
  disabled = false,
  placeholder = {
    text: 'Drag and drop or click to upload',
    classNames: 'font-medium text-sm leading-1 text-center',
    iconSize: 32,
  },
}: ImageInputDisplayProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const radius = 100; // Change this to increase the radius of the hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size <= maxSize) {
      onChange?.(file);
    } else {
      toast('Image size exceeds the maximum limit', {
        icon: '❌',
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.size <= maxSize) {
      onChange?.(file);
    } else {
      toast('Image size exceeds the maximum limit', {
        icon: '❌',
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      style={{
        background: useMotionTemplate`radial-gradient(${
          isDragging ? radius + 'px' : '0px'
        } circle at ${mouseX}px ${mouseY}px, var(--blue-500), transparent 80%)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsDragging(false)}
      className={cn(
        'relative p-[2px] rounded-lg transition duration-300 group/input w-full h-full cursor-pointer shadow-input',
        className
      )}
      onDragOver={allowDnd ? handleDragOver : undefined}
      onDragLeave={allowDnd ? handleDragLeave : undefined}
      onDrop={allowDnd ? handleDrop : undefined}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="relative w-full h-full">
        {/* <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        /> */}
        {src ? (
          <>
            <img
              src={src}
              alt="Uploaded"
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
            {onDelete && (
              <button
                className="shadow-xl absolute z-10 top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <XCircleIcon size={20} className="text-gray-500" />
              </button>
            )}
          </>
        ) : (
          <div
            className=" relative w-full h-full flex flex-col items-center justify-center px-4 py-2 bg-radial-gradient gap-y-2"
            onDragOver={allowDnd ? handleDragOver : undefined}
          >
            <div className="w-full absolute top-0 left-0 h-full bg-white bg-opacity-25 opacity-75">
              <StyledInput
                type="file"
                accept="image/*"
                className="hidden h-full"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <ImageUp size={placeholder.iconSize} />
            <StyledText
              children={
                isDragging && allowDnd ? 'Release to upload' : placeholder.text
              }
              className={cn(
                placeholder.classNames,
                isDragging && allowDnd ? 'text-white' : 'text-gray-500'
              )}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageInputDisplay;
