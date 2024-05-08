import { useRef } from 'react';
import Dropdown from '../Reusables/Dropdown';
import HoverEffect from '../Reusables/HoverEffect';
import { cn } from '../../utils/cn';
import { HashIcon, PlusIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import StyledInput from './StyledInput';
import Spinner from '../Reusables/Spinner';
import { COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';

export interface ISelectOption {
  id: string;
  label: string;
}

type MultiSelectProps<T extends ISelectOption> = {
  options: T[];
  selected: T[];
  onSelect: (option: T) => void;
  onRemove: (option: T) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  minSelection?: number;
  maxSelection?: number;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  onSearchChange?: (query: string) => void;
  onCreate?: () => void;
};
const MultiSelect = ({
  options,
  selected,
  onSelect,
  onRemove,
  placeholder = 'Select tags',
  searchPlaceholder = 'Search for tags..',
  minSelection = 0,
  maxSelection = 3,
  disabled,
  className,
  onCreate,
  onSearchChange,
  isLoading = true,
}: MultiSelectProps<ISelectOption>) => {
  const searchInput = useRef<HTMLInputElement>(null);

  const searchQuery = searchInput.current?.value ?? '';
  return (
    <Dropdown
      disabled={disabled}
      items={[
        {
          bordered: true,
          element: (
            <div className="w-full flex flex-col py-2 gap-y-4">
              <StyledInput
                ref={searchInput}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full text-base border-none"
                placeholder={searchPlaceholder}
                rightIcon={
                  <Spinner
                    isLoading={isLoading}
                    className="right-1 top-1/2"
                    fill={COLORS.primary}
                  />
                }
              />

              <motion.div className="w-full flex flex-wrap gap-2">
                {options
                  .filter(
                    (option) =>
                      !selected
                        .map((selected) => selected.id)
                        .includes(option.id)
                  )
                  .map((option, i) => (
                    <Option
                      index={i}
                      key={option.id}
                      onClick={() => {
                        if (selected.length >= maxSelection) {
                          toast.error(
                            `You can only select ${maxSelection} tags`
                          );
                          return;
                        }
                        onSelect(option);
                      }}
                      icon={<HashIcon size={14} />}
                      label={option.label}
                    />
                  ))}
                <div
                  className={cn('hidden justify-center items-center py-4', {
                    flex:
                      options.length === 0 &&
                      searchQuery.length > 0 &&
                      onCreate,
                  })}
                >
                  <Option
                    onClick={() => onCreate?.()}
                    icon={<PlusIcon size={16} color="var(--blue-500)" />}
                    label={
                      <span>
                        No results found, Create tag{' '}
                        <span className="text-blue-500">
                          {`#${searchQuery}`}
                        </span>
                      </span>
                    }
                  />
                </div>
              </motion.div>
            </div>
          ),
        },
      ]}
      closeOnClick={false}
      targetComponent={
        <HoverEffect className={className}>
          <motion.button
            className={cn(
              `flex bg-neutral-100 w-full border-none shadow-input rounded-md px-2 py-2 text-sm placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none transition duration-400 gap-1 items-center overflow-x-auto overflow-y-hidden no-scrollbar
         `
            )}
            key={selected.length}
            transition={{ duration: 0.3 }}
          >
            {selected.length === 0 && (
              <span className="text-neutral-400 dark:text-neutral-600 text-base font-medium">
                {placeholder}
              </span>
            )}
            {selected.map((option) => (
              <Capsule
                key={option.id}
                label={option.label}
                onClick={() => {
                  if (selected.length === minSelection) {
                    toast.error(`You must select atleast ${minSelection} tag`);
                    return;
                  }
                  onRemove(option);
                }}
              />
            ))}
          </motion.button>
        </HoverEffect>
      }
      position="left"
      takeParentWidth
      takeFullWidth
      gap={0}
    />
  );
};

export const Capsule = ({
  label,
  onClick,
  disabled = false,
  index = 1,
  showIcon = true,
  className,
  selected = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  index?: number;
  showIcon?: boolean;
  className?: string;
  selected?: boolean;
}) => {
  return (
    <motion.button
      disabled={disabled}
      whileHover={{
        boxShadow: '0 0 0 1px var(--blue-500)',
        transition: { duration: 0.1 },
      }}
      whileTap={{
        boxShadow: '0 0 0 1px var(--blue-500)',
        transition: { duration: 0.1 },
      }}
      initial={{ opacity: 0, x: -10, boxShadow: '0 0 0 1px transparent' }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.1 * (index + 1),
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={cn(
        'flex items-center bg-white rounded-full px-2 py-1 gap-1 shadow-sm hover:shadow-md transition-all',
        {
          'bg-neutral-300': selected,
          'cursor-pointer': !disabled,
          'cursor-not-allowed': disabled,
        },
        className
      )}
      onClick={onClick}
    >
      <span className="text-sm font-medium">{label}</span>
      {showIcon && (
        <X
          className="cursor-pointer transition-all hover:scale-110 ease-linear duration-150"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          size={16}
          color="var(--red-500)"
        />
      )}
    </motion.button>
  );
};

export const Option = ({
  onClick,
  icon,
  label,
  index = 1,
  disabled = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: React.ReactNode;
  index?: number;
  disabled?: boolean;
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.1 * (index + 1),
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      key={label?.toString()}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 0 0 1px var(--blue-500)',
        transition: { duration: 0.1 },
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: '0 0 0 1px var(--blue-500)',
        transition: { duration: 0.1 },
      }}
      className="flex justify-between items-center bg-white border border-neutral-300 rounded-full px-3 py-1 gap-1 cursor-pointer"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-base font-medium">{label}</span>
      {icon}
    </motion.button>
  );
};

export default MultiSelect;
