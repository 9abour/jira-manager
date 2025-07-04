import { useLang } from '@hooks/useLang';
import type { ButtonTextProps } from '@ui/common/types/ButtonText.types';
import { cn } from '@utils/cn';
import { useNavigate } from 'react-router';

const Button = ({
  className,
  href,
  internal,
  children,
  ...props
}: ButtonTextProps) => {
  const navigate = useNavigate();
  const { lang: currentLanguage } = useLang();

  const handleClick = () => {
    if (internal) {
      const newPath = `/${currentLanguage}${href}`;

      navigate(newPath!);
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <button
      onClick={href ? handleClick : undefined}
      {...props}
      className={cn(
        'w-fit h-[35px] gap-[10px] rounded-[7px] px-[16px] font-medium text-[16px] leading-[140%] tracking-normal bg-primary text-white border border-transparent hover:border-primary/20 hover:bg-primary/20 hover:text-[#253B80] transition-colors duration-500',
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
