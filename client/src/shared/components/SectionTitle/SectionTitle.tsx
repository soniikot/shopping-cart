import style from './styles.module.scss';

interface SectionTitleProps {
  text: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ text }) => {
  return (
    <div className={style.wrapper}>
      <h3 className={style.title}>{text}</h3>
    </div>
  );
};
