import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__header">
              <h1 className="error-boundary__title">Something went wrong</h1>
              <p className="error-boundary__description">
                We're sorry, but it looks like something went wrong. Please try again later.
              </p>
            </div>
            <div className="error-boundary__actions">
              <Link to="/" className="error-boundary__button">
                Back to Home
              </Link>
            </div>
            <div className="error-boundary__ambient">
              <div className="error-boundary__ambient-circle" />
              <div className="error-boundary__ambient-circle" />
              <div className="error-boundary__ambient-circle" />
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;