import { useState, useEffect } from 'react';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ErrorBoundary = ({ children }) => {
    const [error, setError] = useState(false);

    useEffect(() => {
        const errorHandler = (error, errorInfo) => {
            console.log(error, errorInfo);
            setError(true);
        };

        window.onerror = errorHandler;
        window.onunhandledrejection = errorHandler;

        return () => {
            window.onerror = null;
            window.onunhandledrejection = null;
        };
    }, []);

    if (error) {
        return <ErrorMessage />;
    }

    return children;
};

export default ErrorBoundary;
