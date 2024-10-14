import { FC } from 'react';
import { TextButton } from '@/shared/components/TextButton/TextButton';
import style from './styles.module.scss';

interface EmptyList {
  text: string;
}

export const EmptyList: FC<EmptyList> = ({ text }) => {
  return (
    <div className={style.wrapper}>
      <h2>{text}</h2>

      <TextButton text="Continue Shopping" buttonColor="purple" link="/" />
    </div>
  );
};
