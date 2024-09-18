import style from './styles.module.scss';
import { SectionTitleProps } from '@/types/interfaces';
import { FC } from 'react';

export const SectionTitle: FC<SectionTitleProps> = ({ text }) => {
  return (
    <div className={style.wrapper}>
      <h3 className={style.title}>{text}</h3>
    </div>
  );
};
