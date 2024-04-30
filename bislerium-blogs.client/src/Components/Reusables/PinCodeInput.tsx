import { createRef, useEffect } from 'react';
import {
  addToPosition,
  parseStringToNumber,
  removeFromPosition,
  seekValue,
} from '../../utils/string';
import StyledInput from '../Elements/StyledInput';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface IPinCodeInputProps {
  length?: number;
  onChange: (num?: number) => void;
  value?: number;
  className?: string;
}

const PinCodeInput = ({
  value,
  onChange,
  length = 6,
  className,
}: IPinCodeInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent, position: number) => {
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        if (text.length !== length) {
          toast.error(`Must be ${length} digits long.`);
          return;
        }
        const isValidNumber = text
          .split('')
          .every((char) => char.match(/[0-9]/));
        if (!isValidNumber) {
          toast.error('Only Numbers Allowed.');
          return;
        }
        allInputRefs[length - 1].current?.focus();
        onChange(+text);
      });
      return;
    }
    console.log('key pressed', e.key);
    const enteredKey = e.key.toLowerCase();
    if (!enteredKey.match(/[0-9]|Backspace|Control|v/gi)) {
      return;
    }

    if (enteredKey === 'backspace') {
      console.log('backspace');
      if (value !== undefined) {
        const valueOnThatPositionExists = seekValue(value, position);
        console.log(
          valueOnThatPositionExists,
          position,
          'valueOnThatPositionExists'
        );
        const newValue = removeFromPosition(
          value,
          valueOnThatPositionExists !== undefined ? position : position - 1
        );
        console.log(newValue, 'new value');
        onChange(newValue);
        if (position !== 0) {
          const el = allInputRefs[position - 1]?.current;
          if (el) {
            el.disabled = false;
            el.focus();
          }
        }
      }
    }

    if (value?.toString().length === length) return;

    if (parseStringToNumber(enteredKey) !== undefined) {
      if (value === undefined) {
        onChange(+enteredKey);
      } else {
        const newValue = addToPosition(value, position, +enteredKey) as number;
        console.log(newValue, 'new value now');
        onChange(newValue);
      }

      const el = allInputRefs[position + 1]?.current;
      if (el) {
        el.disabled = false;
        el.focus();
      }
    }
  };
  const allInputRefs: React.RefObject<HTMLInputElement>[] = new Array(length)
    .fill(0)
    .map(() => createRef<HTMLInputElement>());

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      // Paste
      const IsAnyInputFocused = allInputRefs.some(
        (ref) => ref.current === document.activeElement
      );
      if (IsAnyInputFocused) return;

      if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigator.clipboard.readText().then((text) => {
          if (text.length > length) {
            toast.error(`Must be ${length} digits long.`);
            return;
          }
          const isValidNumber = text
            .split('')
            .every((char) => char.match(/[0-9]/));
          if (!isValidNumber) {
            toast.error('Only Numbers Allowed.');
            return;
          }
          allInputRefs[length - 1].current?.focus();
          onChange(+text);
        });
      }
    };
    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);
  }, [allInputRefs, length, onChange]);

  useEffect(() => {
    console.log(value, 'VALUE');
  }, [value]);

  useEffect(() => {
    allInputRefs?.[0]?.current?.focus();
  }, []);
  return (
    <div
      className={cn(
        'flex flex-row space-x-3 justify-between items-center w-full',
        className
      )}
    >
      {new Array(length).fill(0).map((_, i) => {
        return (
          <div
            key={i}
            className="w-16 h-24 rounded-xl overflow-hidden border border-b-2"
          >
            <StyledInput
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={
                value !== undefined
                  ? seekValue(value, i) !== undefined
                    ? seekValue(value, i)
                    : ''
                  : ''
              }
              fullHeight
              className="flex items-center justify-center text-2xl text-center font-semibold"
              onKeyDown={(e) => handleKeyDown(e, i)}
              ref={allInputRefs[i]}
              onChange={(e) => e.preventDefault()}
              disabled={
                (value === undefined && i !== 0) ||
                (value !== undefined && value.toString().length < i)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default PinCodeInput;
