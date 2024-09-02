interface IconButtonProps {
  icon: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon }) => {
  return (
    <button className="icon-button">
      <img src={icon} />
    </button>
  );
};
