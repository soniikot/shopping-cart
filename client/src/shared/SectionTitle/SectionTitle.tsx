import style from './section-title.module.css';

interface SectionTitleProps {
  text: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ text }) => {
  return <h3 className={style.title}>{text}</h3>;
};
