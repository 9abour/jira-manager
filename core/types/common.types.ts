import type { ThemeSlice } from 'infrastructure/store/themeSlice';

export interface LoaderData {
  theme: ThemeSlice['mode'];
  lang: string;
  t: (key: string) => string;
}

export interface LoaderReturnType extends Response {
  json(): Promise<LoaderData>;
}
