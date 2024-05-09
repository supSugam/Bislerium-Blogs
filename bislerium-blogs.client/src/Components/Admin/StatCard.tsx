import { motion, AnimatePresence } from 'framer-motion';
import Counter from './Counter';
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-normal p-6 flex flex-col items-center border-neutral-300"
    >
      <div className="text-4xl text-primary mb-2">{icon}</div>
      <div className="text-3xl font-bold">
        <AnimatePresence mode="wait">
          <motion.span key={value}>
            {value === 0 ? 0 : <Counter value={value} direction="up" />}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="text-neutral-600 text-base">{label}</div>
    </motion.div>
  );
};

export default StatCard;
