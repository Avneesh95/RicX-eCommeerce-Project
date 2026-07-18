import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="flex flex-col items-center">

        {/* Logo */}
        <h1 className="text-5xl font-extrabold tracking-wide mb-6 text-gray-900 dark:text-white">
          <span className="text-gray-900 dark:text-white">Ric</span>
          <span className="text-blue-600">X</span>
        </h1>

        {/* Spinner */}
        <Loader2
          className="animate-spin text-blue-600"
          size={50}
          strokeWidth={2.5}
        />

        {/* Loading Text */}
        <div className="flex items-center mt-5 text-gray-600 dark:text-gray-400 font-medium text-lg">
          {text}
          <span className="animate-bounce ml-1">.</span>
          <span
            className="animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            .
          </span>
          <span
            className="animate-bounce"
            style={{ animationDelay: "0.4s" }}
          >
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;