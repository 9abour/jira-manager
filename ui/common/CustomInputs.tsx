import { useLang } from '@hooks/useLang';
import type {
  InputFileWithLabelProps,
  InputProps,
  InputWithLabelProps,
} from '@ui/common/types/custom-inputs.types';

import { cn } from '@utils/cn';
import { ATTACHMENT_ICON, INPUT_STAR } from 'assets/icons/common.icons';
import { X } from 'lucide-react';
import React from 'react';

const Input = ({ className, onKeyPress, onFocus, ...props }: InputProps) => {
  const { lang } = useLang();

  return (
    <input
      {...props}
      onKeyPress={onKeyPress}
      onFocus={onFocus}
      className={cn(
        'h-[51px] w-full px-[16px] rounded-[4px] bg-[#F2F2F2] text-primary placeholder:text-[#666666] transition outline-0 border-2 border-transparent focus:border-primary/80',
        className
      )}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    />
  );
};

const InputWithLabel = ({ label, required, ...props }: InputWithLabelProps) => {
  return (
    <div className="w-full">
      <label className="flex gap-1 mb-1 font-bold text-[14px] leading-[140%] tracking-normal">
        {label}
        {required && <span className="w-[4px] h-[4px]">{INPUT_STAR}</span>}
      </label>
      <Input {...props} />
    </div>
  );
};

const InputFileWithLabel = ({
  label,
  required,
  type,
  placeholder,
  onChange,
  deleteFileFromState,
  accept,
}: InputFileWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null | undefined>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setFile(e.target.files?.[0]);
  };

  const handleDeleteFile = () => {
    setFile(null);
    deleteFileFromState();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="flex gap-1 mb-1 font-bold text-[14px] leading-[140%] tracking-normal">
        {label}
        {required && <span className="w-[4px] h-[4px]">{INPUT_STAR}</span>}
      </label>

      <input
        type={type}
        accept={accept}
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />

      {file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-[51px] w-full text-start flex-jc-sb flex-ai-c px-[16px] rounded-[4px] bg-[#F2F2F2] text-[#666666] placeholder:text-[#666666] transition outline-0 border border-transparent focus:border-[#263B80]/10"
        >
          <span className="line-clamp-1">{file.name}</span>

          <X
            size={32}
            className="cursor-pointer hover:text-red-400 transition"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleDeleteFile();
            }}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-[51px] w-full flex-jc-sb flex-ai-c px-[16px] rounded-[4px] bg-[#F2F2F2] text-[#666666] placeholder:text-[#666666] transition outline-0 border border-transparent focus:border-[#263B80]/10"
        >
          {placeholder}
          {ATTACHMENT_ICON}
        </button>
      )}
    </div>
  );
};

export { Input, InputWithLabel, InputFileWithLabel };
