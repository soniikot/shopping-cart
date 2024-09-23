import style from './styles.module.scss';
import { FC } from 'react';

export interface SectionTitleProps {
  text: string;
}

export const SectionTitle: FC<SectionTitleProps> = ({ text }) => {
  return (
    <div className={style.wrapper}>
      <h3 className={style.title}>{text}</h3>
    </div>
  );
};
