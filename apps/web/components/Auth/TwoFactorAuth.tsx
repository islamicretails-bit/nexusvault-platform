import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon } from '@material-ui/core';
import { CheckCircle, Error, HourglassEmpty } from '@material-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import { TwoFactorAuthProps } from '../../types/auth';
import styles from './TwoFactorAuth.module.css';

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ onVerify, onError }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, twoFactorAuthStatus } = useAuth();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusIcon, setStatusIcon] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (twoFactorAuthStatus === 'pending') {
      setStatusIcon(<HourglassEmpty />);
    } else if (twoFactorAuthStatus === 'success') {
      setStatusIcon(<CheckCircle />);
    } else if (twoFactorAuthStatus === 'error') {
      setStatusIcon(<Error />);
    }
  }, [twoFactorAuthStatus]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onVerify(code);
    } catch (error) {
      onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('twoFactorAuth.title')}</h2>
      <p className={styles.description}>{t('twoFactorAuth.description')}</p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder={t('twoFactorAuth.codePlaceholder')}
          className={styles.input}
        />
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {t('twoFactorAuth.verifyButton')}
        </button>
      </form>
      {statusIcon && (
        <div className={styles.statusIconContainer}>
          <SvgIcon component={statusIcon} />
        </div>
      )}
    </div>
  );
};

export default TwoFactorAuth;