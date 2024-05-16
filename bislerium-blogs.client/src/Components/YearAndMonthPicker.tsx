import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface IYearAndMonthPickerProps {
  onYearAndMonthChange?: (date?: Date) => void;
}

const YearAndMonthPicker = ({
  onYearAndMonthChange,
}: IYearAndMonthPickerProps) => {
  const [year, setYear] = useState<number | undefined>(undefined);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [isYearSelectOpen, setIsYearSelectOpen] = useState(true);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  useEffect(() => {
    if (year !== undefined && month !== undefined) {
      onYearAndMonthChange?.(new Date(year, month));
    } else {
      onYearAndMonthChange?.(undefined);
    }
  }, [year, month, onYearAndMonthChange]);

  return (
    <div className="flex border border-neutral-300 rounded-md w-full flex-col">
      <div className="flex justify-between items-center p-2 border-b border-neutral-300">
        <ChevronLeft
          size={20}
          className={cn('cursor-pointer', {
            'opacity-50 disabled cursor-not-allowed': isYearSelectOpen,
          })}
          onClick={() => {
            setIsYearSelectOpen(true);
          }}
        />
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.2,
          }}
          key={isYearSelectOpen + '-' + year + '-' + month}
          className="text-lg text-neutral-600"
        >
          {isYearSelectOpen
            ? 'Select Year'
            : year !== undefined && month !== undefined
            ? `${year} - ${months[month - 1]}`
            : year !== undefined
            ? year
            : 'Select Month'}
        </motion.span>

        <ChevronRight
          size={20}
          onClick={() => {
            if (year !== undefined) {
              setIsYearSelectOpen(false);
            } else {
              toast('Please select a year first', {
                icon: '📅',
                position: 'top-right',
              });
            }
          }}
          className={cn('cursor-pointer', {
            'opacity-50 disabled cursor-not-allowed':
              year === undefined || !isYearSelectOpen,
          })}
        />
      </div>
      <div className="grid grid-cols-3 grid-rows-4 flex-1">
        {!isYearSelectOpen ? (
          <>
            {months.map((_month, index) => (
              <motion.div
                className="flex flex-1"
                initial={{
                  opacity: 0,
                  x: -5,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: index * 0.1,
                }}
                key={isYearSelectOpen + '-' + index}
              >
                <motion.button
                  onClick={() => {
                    if (month === index + 1) {
                      setMonth(undefined);
                      setYear(undefined);
                    } else {
                      if (
                        year !== undefined &&
                        new Date().getFullYear() === year &&
                        new Date().getMonth() < index
                      ) {
                        toast('Please select a month in the past', {
                          icon: '📅',
                          position: 'top-right',
                        });
                      } else {
                        setMonth(index + 1);
                      }
                    }
                  }}
                  className={cn(
                    'w-full justify-center items-center py-3 hover:bg-neutral-100 text-neutral-600 transition-all duration-200',
                    {
                      'font-semibold': month === index + 1,
                      'opacity-50 disabled cursor-not-allowed':
                        year !== undefined &&
                        new Date().getMonth() < index &&
                        year === new Date().getFullYear(),
                    }
                  )}
                >
                  {_month}
                </motion.button>
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {Array.from({ length: 12 }, (_, i) => i).map((_, index) => (
              <motion.div
                className="flex flex-1"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: index * 0.1,
                }}
                key={isYearSelectOpen + '-' + index}
              >
                <button
                  key={index}
                  onClick={() => {
                    setYear(new Date().getFullYear() - index);
                    setIsYearSelectOpen(false);
                  }}
                  className={cn(
                    'flex flex-1 justify-center items-center py-3 hover:bg-neutral-100 text-neutral-600 transition-all duration-20',
                    {
                      'font-semibold':
                        year === new Date().getFullYear() - index,
                    }
                  )}
                >
                  {new Date().getFullYear() - index}
                </button>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default YearAndMonthPicker;
