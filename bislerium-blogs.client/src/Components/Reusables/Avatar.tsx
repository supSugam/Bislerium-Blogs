import classNames from 'classnames';
import { AVATAR_PLACEHOLDER } from '../../utils/constants';
interface IAvatarProps {
  size?: 'small' | 'medium' | 'large' | number;
  src?: string | null;
}
const Avatar = ({ size = 'medium', src }: IAvatarProps) => {
  const classes = classNames('rounded-full bg-gray-100 overflow-hidden', {
    'w-6 h-6': size === 'small',
    'w-10 h-10': size === 'medium',
    'w-14 h-14': size === 'large',
  });
  return (
    <div
      className={classes}
      style={{
        ...((typeof size === 'number' && { width: size, height: size }) || {}),
      }}
    >
      <img
        src={src ?? AVATAR_PLACEHOLDER}
        alt="avatar"
        className="rounded-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Avatar;
