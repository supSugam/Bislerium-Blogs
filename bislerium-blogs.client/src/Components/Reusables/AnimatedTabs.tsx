import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

type Tab = {
  title: string;
  value: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
};

export const AnimatedTabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setTabs(propTabs);
  }, [propTabs]);

  return (
    <div className="flex flex-col gap-y-5">
      <div
        className={cn(
          'flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full gap-x-5',
          containerClassName
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn(
              'relative px-4 py-2 rounded-full flex gap-x-2 items-center',
              tabClassName
            )}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                className={cn(
                  'absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full ',
                  activeTabClassName
                )}
              />
            )}

            <span
              className={cn('relative block font-medium', {
                'text-neutral-50': active.value === tab.value,
                'text-primary': active.value !== tab.value,
              })}
            >
              {tab.icon}
            </span>

            <span
              className={cn('relative block font-medium', {
                'text-neutral-50': active.value === tab.value,
                'text-primary': active.value !== tab.value,
              })}
            >
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
        className={cn(contentClassName)}
      />
    </div>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  active,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  return (
    <div className="relative w-full h-full flex-1 mt-4">
      {tabs.map((tab) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          initial={{ opacity: isActive(tab) ? 1 : 0 }}
          animate={{ opacity: isActive(tab) ? 1 : 0 }}
          exit={{ opacity: isActive(tab) ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className={cn('w-full h-full', className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
