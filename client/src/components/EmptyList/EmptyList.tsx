import { FC } from 'react';
import { TextButton } from '@/shared/components/TextButton/TextButton';
import style from './styles.module.scss';

export const EmptyList: FC = () => {
  return (
    <div className={style.wrapper}>
      <h2>Sorry, nothing found</h2>
      <p>Try again </p>
      <TextButton
        text="Continue Shopping"
        buttonColor="purple"
        link="/products/"
      />
    </div>
  );
};
