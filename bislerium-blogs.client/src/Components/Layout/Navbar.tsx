import { useState } from 'react';
import { Heart, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import WriteIcon from '../../lib/SVGs/WriteIcon';
import NotificationIcon from '../../lib/SVGs/NotificationIcon';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { cn } from '../../utils/cn';
import Dropdown from '../Reusables/Dropdown';
import Avatar from '../Reusables/Avatar';
import SearchInput from '../SearchInput';
import { useAuthStore } from '../../services/stores/useAuthStore';

const Navbar = () => {
  const { scrollYProgress } = useScroll();
  const { openAuthModal } = useAuthStore();

  const [visible, setVisible] = useState<boolean>(true);

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === 'number') {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(true);
        }
      }
    }
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          'flex w-full justify-between fixed top-0 inset-x-0 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[111] pr-2 pl-8 py-2 items-center border-b-black'
        )}
      >
        <div className="flex items-center space-x-3">
          <Link to="/">
            <Heart size={30} />
          </Link>
          <SearchInput />
        </div>
        <div className="flex items-center space-x-7">
          <span className="flex items-center space-x-2 opacity-70 hover:opacity-100 duration-100 ease-in cursor-pointer">
            <WriteIcon size={24} />
            <p className="font-light text-sm">Write</p>
          </span>
          <NotificationIcon size={24} onClick={openAuthModal} />
          <Dropdown
            targetComponent={<Avatar />}
            items={[
              {
                label: 'Profile',
                onClick: () => console.log('Profile'),
                icon: <UserRound size={20} />,
                bordered: true,
              },
              {
                label: 'Settings',
                onClick: () => console.log('Settings'),
                icon: <UserRound size={20} />,
                bordered: true,
              },
              {
                label: 'Logout',
                onClick: () => console.log('Logout'),
                icon: <UserRound size={20} />,
                bordered: true,
              },
            ]}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;