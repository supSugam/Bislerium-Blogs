import { X } from 'lucide-react';

const XButton = ({
  onClick,
  size = 20,
}: {
  onClick?: () => void;
  size?: number;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center shadow-sm bg-neutral-200 bg-opacity-40 hover:bg-opacity-80 transition-all cursor-pointer duration-150 p-2 rounded-full hover:rotate-90"
    >
      <X size={size} />
    </button>
  );
};

export default XButton;
