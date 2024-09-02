interface IconButtonProps {
  icon: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon }) => {
  return (
    <button>
      <img src={icon} />
    </button>
  );
};
