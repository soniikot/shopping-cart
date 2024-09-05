import style from './style.module.css';

interface TextButtonProps {
  text: string;
}

export const TextButton: React.FC<TextButtonProps> = ({ text }) => {
  return <button className={style.button}> {text}</button>;
};
