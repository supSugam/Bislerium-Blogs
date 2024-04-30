import { useEffect, useRef, useState } from 'react';
import PinCodeInput from './Reusables/PinCodeInput';
import StyledButton from './Elements/StyledButton';
import StyledText from './Elements/StyledText';
import toast from 'react-hot-toast';
interface IOTPVerificationProps {
  code?: number;
  onCodeChange: (code?: number) => void;
  sentTo: string;
  onResend?: () => void;
  resendInterval?: number;
  onVerify: () => void;
}

const OTPVerification = ({
  code,
  onCodeChange,
  sentTo,
  onResend,
  resendInterval,
  onVerify,
}: IOTPVerificationProps) => {
  const [resendIn, setResendIn] = useState<number>(resendInterval || 0);

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (resendIn > 0) {
      intervalRef.current = setInterval(() => {
        setResendIn((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resendIn]);

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <StyledText className="text-center">
        Please enter the 6-digit code sent to <br></br>
        <strong>{sentTo}</strong>
      </StyledText>
      <PinCodeInput value={code} onChange={onCodeChange} className="my-8" />
      <StyledButton onClick={onVerify} text="Submit" variant="dark" />

      {resendInterval !== undefined && (
        <StyledButton
          onClick={() => {
            setResendIn(resendInterval);
            if (resendIn === 0 && onResend) {
              toast.success('OTP Resent!');
              onResend();
            }
          }}
          text={
            <StyledText className="font-medium">
              {`${resendIn > 0 ? `Resend in ${resendIn} seconds` : 'Resend'}`}
            </StyledText>
          }
          disabled={resendIn > 0}
          variant="secondary"
          className="w-full mt-3"
        />
      )}
    </div>
  );
};

export default OTPVerification;
