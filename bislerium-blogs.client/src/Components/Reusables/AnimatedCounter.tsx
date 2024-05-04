import {
  MotionValue,
  motion,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import { Minus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { cn } from '../../utils/cn';

const fontSize = 30;
const padding = 15;
const height = fontSize + padding;

function AnimatedCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  return (
    <div
      className={cn(
        'flex overflow-hidden leading-none text-lg items-center justify-center px-1',
        className
      )}
    >
      {isNegative && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isNegative ? 0.7 : 0, scale: isNegative ? 1 : 0 }}
          exit={{ opacity: 0, scale: 0 }}
          className="mt-1"
          whileHover={{ opacity: 0.9 }}
        >
          <Minus size={12} strokeWidth={3} />
        </motion.div>
      )}
      {useMemo(() => {
        const places = new Array(absValue.toString().length)
          .fill(0)
          .map((_, index) => +('1' + new Array(index).fill(0).join('')))
          .reverse();
        return places.map((place, i) => (
          <Digit key={i} place={place} value={absValue} />
        ));
      }, [absValue])}
    </div>
  );
}

function Digit({ place, value }: { place: number; value: number }) {
  const valueRoundedToPlace = Math.floor(value / place);
  const mv = useMotionValue(0);

  useEffect(() => {
    const controls = animate(mv, valueRoundedToPlace, { type: 'spring' });
    return controls.stop;
  }, [mv, valueRoundedToPlace]);

  return (
    <div style={{ height }} className="relative w-[1ch] tabular-nums">
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={mv} number={i} />
      ))}
    </div>
  );
}

function Number({ mv, number }: { mv: MotionValue<number>; number: number }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {number === 11 ? '-' : number}
    </motion.span>
  );
}

export default AnimatedCounter;
