import React, { ReactNode } from 'react';
import StyledText from '../Elements/StyledText';

export default function ButtonWithIcon({
  icon, // FontAwesome icon className
  children,
  disabled = false,
  onClick,
}: {
  icon: React.ReactNode;
  children: ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}) {
  return (
    <button
      className="py-3 border border-solid border-neutral-400 rounded-full flex justify-center w-full"
      onClick={onClick}
      disabled={disabled}
    >
      <StyledText className="flex items-center gap-3 text-base text-lighterblack leading-5 text-left">
        {icon}
        {children}
      </StyledText>
    </button>
  );
}
