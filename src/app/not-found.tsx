import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mb-8 text-gray-600">
          Oops! The page {"you're"} looking for {"doesn't"} exist.
        </p>
        <Link
          href="/"
          className="inline-block rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
