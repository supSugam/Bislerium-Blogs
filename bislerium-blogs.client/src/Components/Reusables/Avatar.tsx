import classNames from 'classnames';
interface IAvatarProps {
  size?: 'small' | 'medium' | 'large' | number;
  src?: string | null;
}
const Avatar = ({ size = 'medium', src }: IAvatarProps) => {
  const classes = classNames('rounded-full bg-gray-100 overflow-hidden', {
    'w-6': size === 'small',
    'w-10': size === 'medium',
    'w-14': size === 'large',
    [`w-${size}`]: typeof size === 'number',
    [`h-${size}`]: typeof size === 'number',
  });
  return (
    <div className={classes}>
      <img
        src={src ?? 'https://avatar.iran.liara.run/public/92'}
        alt="avatar"
        className="rounded-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Avatar;
