import { FC } from 'react';
import style from './styles.module.scss';

export interface FeatureWithProps {
  icon: string;
  text: string;
}

export const Feature: FC<FeatureWithProps> = ({ icon, text }) => {
  return (
    <div className={style.wrapper}>
      <img src={icon} alt="" />
      <h5>{text}</h5>
    </div>
  );
};
