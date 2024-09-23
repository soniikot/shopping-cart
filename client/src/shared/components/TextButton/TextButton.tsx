import style from './style.module.css';
import { TextButtonProps } from '@/types/interfaces';

export const TextButton: React.FC<TextButtonProps> = ({ text }) => {
  return <button className={style.button}> {text}</button>;
};
