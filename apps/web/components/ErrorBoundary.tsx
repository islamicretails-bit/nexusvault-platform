import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={classnames(styles.errorBoundary, styles.fadeIn)}>
          <div className={styles.errorContainer}>
            <h1 className={styles.errorTitle}>Something went wrong</h1>
            <p className={styles.errorDescription}>
              We're sorry, but it looks like something went wrong. Please try again later or contact our support team.
            </p>
            <Link to="/" className={styles.errorLink}>
              Back to Home
            </Link>
          </div>
          <div className={styles.errorAmbient}>
            <div className={styles.errorAmbientItem} />
            <div className={styles.errorAmbientItem} />
            <div className={styles.errorAmbientItem} />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;