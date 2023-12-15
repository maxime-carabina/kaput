import { Link } from 'react-router-dom';

export function Error() {
  return (
    <div id="error-page" className="text-f-primary">
      <h1 className="kp-banner">Error</h1>
      <p className="kp-body">
        Unexpected error. Please try again later or contact the administrator.
      </p>
      <Link to="index" className="underline">
        link
      </Link>
    </div>
  );
}
