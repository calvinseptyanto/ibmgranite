import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const SignatureModal = ({ isOpen, onClose, onSave }) => {
  const sigCanvas = useRef(null);

  const handleSave = () => {
    if (sigCanvas.current.isEmpty()) return;
    const signatureData = sigCanvas.current.toDataURL();
    onSave(signatureData);
    sigCanvas.current.clear();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Create Your Signature
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="mt-4">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: 'bg-white border border-gray-200 rounded-md shadow-sm',
                width: 500,
                height: 200,
                style: { width: '100%', height: '200px' }
              }}
            />
            <div className="mt-2 text-sm text-gray-500">
              Use your mouse or touch device to draw your signature
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => sigCanvas.current.clear()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Signature
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignatureModal;