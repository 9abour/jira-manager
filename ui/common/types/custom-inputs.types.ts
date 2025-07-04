export interface InputProps {
  type: string;
  placeholder: string;
  required?: boolean;
  name: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: any) => void;
}

export interface InputWithLabelProps extends InputProps {
  label: string;
}

export interface InputFileWithLabelProps extends InputProps {
  label: string;
  type: 'file';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteFileFromState: () => void;
  accept?: string;
}
