import React, { ChangeEvent, useCallback, useRef } from 'react';

interface ImagePickerProps {
  disabled?: boolean;
  accept?: string;
  children?: React.ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
const ImagePicker = ({
  disabled = false,
  accept = 'image/*',
  children,
  onChange,
}: ImagePickerProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (!disabled && ref.current) {
      ref.current.value = '';
      ref.current.click();
    }
  }, [disabled]);

  return (
    <div className="relative" onClick={handleClick}>
      <input
        type="file"
        ref={ref}
        accept={accept}
        className="absolute w-full h-full top-0 left-0 invisible"
        onChange={onChange}
      />
      {children}
    </div>
  );
};

export default ImagePicker;
