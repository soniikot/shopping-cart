import { FC } from 'react';
import style from './styles.module.scss';
import { FeatureWithProps } from '@/types/interfaces';

export const Feature: FC<FeatureWithProps> = ({ icon, text }) => {
  return (
    <div className={style.wrapper}>
      <img src={icon} alt="" />
      <h5>{text}</h5>
    </div>
  );
};
