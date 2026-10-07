"use client";

import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
}

export default function SignaturePad({ onSave, onClear }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    onClear();
  };

  const handleEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-2">
      <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
          }}
          onEnd={handleEnd}
        />
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Signez dans le cadre ci-dessus à la souris ou au doigt.</span>
        <button
          type="button"
          onClick={clear}
          className="text-red-600 hover:text-red-800 underline font-medium"
        >
          Effacer
        </button>
      </div>
    </div>
  );
}
