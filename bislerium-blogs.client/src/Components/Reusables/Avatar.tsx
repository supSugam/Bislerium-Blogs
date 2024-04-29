import classNames from 'classnames';
interface IAvatarProps {
  size?: 'small' | 'medium' | 'large';
  src?: string;
}
const Avatar = ({
  size = 'medium',

  src = 'https://avatar.iran.liara.run/public/92',
}: IAvatarProps) => {
  const classes = classNames('rounded-full bg-gray-100', {
    'w-6': size === 'small',
    'w-10': size === 'medium',
    'w-14': size === 'large',
  });
  return (
    <button className={classes}>
      <img
        src={src}
        alt="avatar"
        className="rounded-full"
        style={{ width: size, height: size }}
      />
    </button>
  );
};

export default Avatar;
