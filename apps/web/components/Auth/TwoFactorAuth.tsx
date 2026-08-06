import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TwoFactorAuthStatus } from '../../enums/TwoFactorAuthStatus';
import { SvgCheckCircle, SvgErrorCircle, SvgWarningCircle } from '../SvgIcons';

interface TwoFactorAuthProps {
  onAuthSuccess: () => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onAuthSuccess }) => {
  const { user, twoFactorAuth, verifyTwoFactorAuth } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<TwoFactorAuthStatus>(TwoFactorAuthStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (twoFactorAuth && twoFactorAuth.enabled) {
      setStatus(TwoFactorAuthStatus.PENDING);
    } else {
      navigate('/login');
    }
  }, [twoFactorAuth, navigate]);

  const handleVerify = async () => {
    try {
      await verifyTwoFactorAuth(code);
      onAuthSuccess();
    } catch (error: any) {
      setError(error.message);
      setStatus(TwoFactorAuthStatus.ERROR);
    }
  };

  const handleResend = async () => {
    try {
      await twoFactorAuth?.resendCode();
      setStatus(TwoFactorAuthStatus.PENDING);
    } catch (error: any) {
      setError(error.message);
      setStatus(TwoFactorAuthStatus.ERROR);
    }
  };

  const getIcon = () => {
    switch (status) {
      case TwoFactorAuthStatus.IDLE:
        return <SvgWarningCircle />;
      case TwoFactorAuthStatus.PENDING:
        return <SvgWarningCircle />;
      case TwoFactorAuthStatus.SUCCESS:
        return <SvgCheckCircle />;
      case TwoFactorAuthStatus.ERROR:
        return <SvgErrorCircle />;
      default:
        return <SvgWarningCircle />;
    }
  };

  return (
    <div className="two-factor-auth">
      <h2>Two-Factor Authentication</h2>
      {getIcon()}
      <p>
        {twoFactorAuth && twoFactorAuth.enabled
          ? 'Enter the verification code sent to your email or phone.'
          : 'Two-factor authentication is not enabled for this account.'}
      </p>
      {status === TwoFactorAuthStatus.PENDING && (
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Verification code"
        />
      )}
      {status === TwoFactorAuthStatus.PENDING && (
        <button onClick={handleVerify}>Verify</button>
      )}
      {status === TwoFactorAuthStatus.ERROR && (
        <button onClick={handleResend}>Resend code</button>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default TwoFactorAuth;