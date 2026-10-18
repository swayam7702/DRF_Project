import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;