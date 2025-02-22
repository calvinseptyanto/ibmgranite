import React from 'react';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorPage = () => {
  const handleRedirect = () => {
    window.location.href = 'http://localhost:5173/#/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto mt-16">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Error Icon Section */}
            <div className="p-8 bg-slate-50 border-b border-slate-200 flex justify-center">
              <div className="p-4 bg-red-50 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            {/* Error Message Section */}
            <div className="p-8">
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">Error 404: Page Not Found</h1>
                <p className="text-slate-500 text-lg">
                  We couldn't find the page you're looking for. It might have been moved or doesn't exist.
                </p>
              </div>

              {/* Error Details Card */}
              <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Error Details</span>
                </div>
                <p className="text-sm text-slate-600 ml-11">
                  The requested page could not be found on the server. Please check the URL or navigate back to the dashboard.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="flex items-center gap-2 px-6 py-2 border border-slate-200 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
                <Button
                  onClick={handleRedirect}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Home className="w-4 h-4" />
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;