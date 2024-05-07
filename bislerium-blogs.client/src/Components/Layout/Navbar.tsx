import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
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
import SearchInput from '../SearchInput';
import { useAuthStore } from '../../services/stores/useAuthStore';
import { NavbarAvatar } from './Avatar.navbar';
import { useScreenDimensions } from '../../hooks/useScreenDimensions';
import { useMousePosition } from '../../hooks/useMousePosition';
import Notifications from '../Notifications/Notifications';
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import StyledButton from '../Elements/StyledButton';

const Navbar = () => {
  const { scrollYProgress } = useScroll();
  const { openAuthModal, isApiAuthorized } = useAuthStore();

  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  const [navbarTranslateY, setNavbarTranslateY] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const { current } = navbarRef;
    if (current) {
      setNavbarHeight(current.offsetHeight);
      setMounted(true);
    }
  }, []);

  const { height } = useScreenDimensions();

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
      const direction = current! - scrollYProgress.getPrevious()!;
      if (direction < 0) {
        setNavbarTranslateY(0);
      } else {
        if (!mounted) return;
        if (navbarTranslateY * height > navbarHeight) return;
        setNavbarTranslateY((prev) => prev + direction);
        // setNavbarTranslateY((prev) =>
        //   (prev + direction) * height > navbarHeight ? prev : prev + direction
        // );
      }
    }
  });

  const { y } = useMousePosition();

  useEffect(() => {
    if (y <= navbarHeight) {
      setNavbarTranslateY(0);
    }
  }, [y, navbarHeight]);

  const [isNotificationsModalOpen, setNotificationsModalOpen] =
    useState<boolean>(false);

  useDetectOutsideClick(notificationsRef, () => {
    setNotificationsModalOpen(false);
  });

  return (
    <AnimatePresence>
      <motion.div
        ref={navbarRef}
        style={{
          y: mounted
            ? Math.max(-(navbarTranslateY * height), -navbarHeight)
            : 0,
        }}
        className={cn(
          'flex w-full justify-between sticky top-0 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[111] px-8 py-2 items-center transition-all duration-300 ease-in'
        )}
      >
        <div className="flex items-center space-x-3">
          <Link to="/">
            <Heart size={30} />
          </Link>
          <SearchInput />
        </div>
        <div className="flex items-center space-x-7">
          <Link
            to={'/write'}
            className={cn(
              'flex items-center space-x-2 opacity-70 hover:opacity-100 duration-100 ease-in cursor-pointer',
              {
                hidden: !isApiAuthorized(),
              }
            )}
            onClick={(e) => {
              if (!isApiAuthorized()) {
                e.preventDefault();
                openAuthModal();
              }
            }}
          >
            <WriteIcon size={24} />
            <span className="text-sm font-medium">Write</span>
          </Link>
          {/* Notification */}

          <button
            className={cn('flex items-center justify-center relative', {
              hidden: !isApiAuthorized(),
            })}
            onClick={() => setNotificationsModalOpen((p) => !p)}
            ref={notificationsRef}
          >
            <NotificationIcon size={24} />
            <Notifications isOpen={isNotificationsModalOpen} />
          </button>

          {/* Notification End */}
          <NavbarAvatar />

          <div
            className={cn('flex items-center ', {
              hidden: isApiAuthorized(),
            })}
          >
            <StyledButton
              className={cn(
                'flex outline-none border-none opacity-800 hover:opacity-70 transition-all duration-200 ease-in rounded-none'
              )}
              onClick={() => openAuthModal()}
              text="Sign In"
              variant="secondary"
            />

            <StyledButton
              className={'rounded-full scale-90'}
              onClick={() => openAuthModal()}
              text="Get Started"
              variant="dark"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;
