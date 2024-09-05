import style from './styles.module.scss';

interface IconButtonProps {
  icon: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon }) => {
  return (
    <button className={style.button}>
      <img src={icon} />
    </button>
  );
};
