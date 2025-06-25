import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-100 py-10">
      <div className="text-center">
        <Loader2 className="mx-auto animate-spin text-indigo-600" size={48} />
        <p className="mt-4 text-lg font-semibold text-gray-800">Authenticating user...</p>
        <p className="text-sm text-gray-500">Please wait while we verify your session.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
