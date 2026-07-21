 import { useState, useRef, useEffect, useCallback } from "react";

// =============================================
// CONFIGURATION
// =============================================

// Use the cloud backend directly.
// You can override this with an environment variable if needed.
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://late-bobcats-tan.loca.lt";

// =============================================

function Scanner({ onResult }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage({ file, previewUrl });
    setCameraError(null);
  };

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setStatusMessage("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = "Your browser does not support camera access.";
      setCameraError(msg);
      alert("❌ " + msg);
      return;
    }

    if (!window.isSecureContext) {
      setStatusMessage("⚠️ Camera works best with HTTPS. If this fails, try using HTTPS.");
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
        setCameraOn(true);
        setCameraError(null);
        setStatusMessage("📷 Camera ready");
        setTimeout(() => setStatusMessage(""), 2000);
      } else {
        throw new Error("Video element not found (ref is null).");
      }
    } catch (err) {
      console.error("Camera error:", err);
      let userMsg = "Unable to access camera. ";
      switch (err.name) {
        case "NotAllowedError":
        case "PermissionDeniedError":
          userMsg +=
            "Permission denied. Please allow camera access in browser settings and reload.";
          break;
        case "NotFoundError":
        case "DevicesNotFoundError":
          userMsg += "No camera found on this device.";
          break;
        case "NotReadableError":
        case "TrackStartError":
          userMsg += "Camera is busy or not readable.";
          break;
        case "OverconstrainedError":
          userMsg += "Could not use the back camera. Try using the front camera.";
          break;
        case "SecurityError":
          userMsg += "Camera access blocked due to security (HTTPS required).";
          break;
        default:
          userMsg += err.message || "Unknown error.";
      }
      setCameraError(userMsg);
      alert("❌ " + userMsg);
      setStatusMessage("⚠️ " + userMsg);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setCameraOn(false);
    setCameraError(null);
    setStatusMessage("");
  }, [stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      alert("Camera is not ready yet. Please wait.");
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert("Failed to capture image.");
          return;
        }
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        if (selectedImage) {
          URL.revokeObjectURL(selectedImage.previewUrl);
        }
        const previewUrl = URL.createObjectURL(file);
        setSelectedImage({ file, previewUrl });
        stopCamera();
      },
      "image/jpeg",
      0.95
    );
  }, [selectedImage, stopCamera]);

  const scanImage = useCallback(async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    setStatusMessage("☁️ Connecting to cloud backend...");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const formData = new FormData();
    formData.append("image", selectedImage.file);

    try {
      const response = await fetch(`${BACKEND_URL}/detect`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Cloud server error: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);
      setStatusMessage("✅ Connected to cloud backend");
      setTimeout(() => setStatusMessage(""), 3000);
      onResult(data);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setStatusMessage("");
      alert("❌ Unable to reach the cloud backend. Please check your internet connection.");
    } finally {
      abortControllerRef.current = null;
    }
  }, [selectedImage, onResult]);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>🧠 AI Object Scanner</h1>
        <p>
          Upload or capture an image.
          <br />
          <br />
          Our AI detects Chairs and Monitors instantly.
        </p>
      </div>

      <div className="card">
        <h2>Upload Image</h2>
        <br />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
        />
        <br />
        <br />

        {!cameraOn && (
          <button onClick={startCamera} style={{ marginBottom: "15px" }}>
            📷 Open Camera
          </button>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "12px",
            display: cameraOn ? "block" : "none",
          }}
        />

        {cameraOn && (
          <div style={{ marginTop: "10px" }}>
            <button onClick={capturePhoto}>📸 Capture</button>
            <button onClick={stopCamera} style={{ marginLeft: "10px" }}>
              ❌ Close
            </button>
          </div>
        )}

        {cameraError && !cameraOn && (
          <div style={{ color: "red", marginBottom: "10px", marginTop: "10px" }}>
            ⚠️ {cameraError}
            <br />
            <button
              onClick={() => {
                setCameraError(null);
                startCamera();
              }}
              style={{ marginTop: "5px" }}
            >
              🔄 Retry
            </button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <br />
        <br />

        {selectedImage && (
          <img
            className="preview"
            src={selectedImage.previewUrl}
            alt="Preview"
          />
        )}

        <br />
        <br />

        {statusMessage && (
          <p
            style={{
              color: "#666",
              fontStyle: "italic",
              marginBottom: "10px",
            }}
          >
            {statusMessage}
          </p>
        )}

        <button onClick={scanImage} disabled={loading}>
          {loading ? "Scanning..." : "🔍 Scan Image"}
        </button>

        <button
          onClick={() => {
            if (selectedImage) {
              URL.revokeObjectURL(selectedImage.previewUrl);
              setSelectedImage(null);
              resetFileInput();
            }
          }}
          style={{ marginLeft: "10px" }}
        >
          Clear Image
        </button>
      </div>

      <div className="card">
        <h2>How it Works</h2>
        <br />
        <p>
          📷 Capture or upload an image
          <br />
          <br />
          🤖 YOLO detects the object
          <br />
          <br />
          📄 Information page opens automatically
        </p>
      </div>
    </div>
  );
}

export default Scanner;
