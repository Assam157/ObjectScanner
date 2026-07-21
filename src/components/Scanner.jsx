import { useState, useRef, useEffect, useCallback } from "react";

// =============================================
// CONFIGURATION
// =============================================

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://ascent-halt-glorify.ngrok-free.dev";

// =============================================

function Scanner({ onResult, onCapture, isScanning }) {
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const abortControllerRef = useRef(null);

  // ---------- Camera start ----------
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setIsCameraReady(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Your browser does not support camera access.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraReady(true);
        setCameraError(null);
      } else {
        throw new Error("Video element not found.");
      }
    } catch (err) {
      console.error("Camera error:", err);
      let userMsg = "Unable to access camera. ";
      switch (err.name) {
        case "NotAllowedError":
        case "PermissionDeniedError":
          userMsg += "Permission denied. Please allow camera access and reload.";
          break;
        case "NotFoundError":
          userMsg += "No camera found on this device.";
          break;
        default:
          userMsg += err.message || "Unknown error.";
      }
      setCameraError(userMsg);
    }
  }, []);

  // ---------- Stop camera ----------
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, [stream]);

  // ---------- Capture & scan ----------
  const captureAndScan = useCallback(async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      alert("Camera not ready. Please wait.");
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.95)
    );
    if (!blob) {
      alert("Failed to capture image.");
      return;
    }
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

    if (onCapture) onCapture();

    const formData = new FormData();
    formData.append("image", file);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${BACKEND_URL}/detect`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      onResult(data);
    } catch (error) {
      console.error("Scan error:", error);
      alert("❌ Scan failed. Check your connection or try again.");
      if (onResult) onResult(null);
    } finally {
      abortControllerRef.current = null;
    }
  }, [onCapture, onResult]);

  // ---------- Auto-start camera on mount ----------
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Render ----------
  return (
    <div className="scanner-container">
      <div className="camera-wrapper">
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="camera-feed"
          style={{ display: isCameraReady ? "block" : "none" }}
        />

        {/* Fallback states */}
        {!isCameraReady && !cameraError && (
          <div className="camera-placeholder">
            <div className="spinner-small"></div>
            <p>Starting camera…</p>
          </div>
        )}

        {cameraError && (
          <div className="camera-error">
            <p>⚠️ {cameraError}</p>
            <button onClick={startCamera} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* 🆕 Modern scanner overlay (blue grid + line + corners) */}
        {isCameraReady && !isScanning && (
          <div className="scanning-overlay">
            {/* Blue grid pattern */}
            <div className="grid-overlay"></div>

            {/* Blue hue/glow layer */}
            <div className="hue-overlay"></div>

            {/* Moving scanning line */}
            <div className="scanning-line"></div>

            {/* Corner brackets */}
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
          </div>
        )}

        {/* Scanning spinner (processing) */}
        {isScanning && (
          <div className="scan-overlay">
            <div className="spinner"></div>
            <p>Scanning…</p>
          </div>
        )}
      </div>

      {/* Capture button */}
      <button
        className="capture-btn"
        onClick={captureAndScan}
        disabled={isScanning || !isCameraReady}
      >
        <span className="capture-circle"></span>
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default Scanner;