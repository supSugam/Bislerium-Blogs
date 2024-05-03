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

const Navbar = () => {
  const { scrollYProgress } = useScroll();
  const { openAuthModal } = useAuthStore();

  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  const [navbarTranslateY, setNavbarTranslateY] = useState<number>(0);

  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = navbarRef;
    if (current) {
      setNavbarHeight(current.offsetHeight);
    }
  }, []);

  const { height } = useScreenDimensions();

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
      const direction = current! - scrollYProgress.getPrevious()!;
      if (direction < 0) {
        if (navbarTranslateY * height === 0) return;
        setNavbarTranslateY(0);
      } else {
        console.log(navbarTranslateY);
        if (navbarTranslateY * height > navbarHeight) return;
        setNavbarTranslateY((prev) => prev + direction);
      }
    }
  });

  useEffect(() => {
    console.log(Math.min(Math.max(0, -(navbarTranslateY * height)), 0));
  }, [navbarTranslateY, height]);

  return (
    <AnimatePresence>
      <motion.div
        ref={navbarRef}
        style={{
          y: -(navbarTranslateY * height),
        }}
        className={cn(
          'flex w-full justify-between sticky top-0 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[111] pr-2 pl-8 py-2 items-center transition-all duration-300 ease-in'
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
          <NavbarAvatar />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;
