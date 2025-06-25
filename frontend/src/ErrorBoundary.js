import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    info: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({
      error,
      info,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            <summary>Click for details</summary>
            {this.state.error && <p>{this.state.error.toString()}</p>} {/* Add null check */}
            {this.state.info && <pre>{this.state.info.componentStack}</pre>} {/* Add null check */}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
