  import { useState, useRef, useEffect, useCallback } from "react";

// =============================================
// CONFIGURATION
// =============================================

const LOCAL_BASE_URL =
  process.env.REACT_APP_LOCAL_URL ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : `${window.location.protocol}//${window.location.hostname}:5000`);

const FALLBACK_BASE_URL = "https://objectscannerbackend.onrender.com";
const LOCAL_TIMEOUT_MS = 25000;
const CLOUD_TIMEOUT_MS = 30000; // added cloud timeout

// =============================================

function Scanner({ onResult }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null); // to reset the input
  const abortControllerRef = useRef(null);

  // Clean up object URL to avoid memory leaks
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

    // Revoke old preview URL if any
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    // Store file with a preview URL
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage({ file, previewUrl });
  };

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setCameraOn(true);
    } catch (err) {
      console.error(err);
      alert("Unable to access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setCameraOn(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      alert("Camera is not ready. Please wait.");
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
        // Revoke previous preview
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
    setStatusMessage("📡 Connecting to local backend...");

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const formData = new FormData();
    formData.append("image", selectedImage.file);

    const localTimeout = setTimeout(() => {
      controller.abort();
    }, LOCAL_TIMEOUT_MS);

    try {
      const response = await fetch(`${LOCAL_BASE_URL}/detect`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(localTimeout);

      if (!response.ok) {
        throw new Error(`Local server error: ${response.status}`);
      }

      const data = await response.json();
      setStatusMessage("");
      setLoading(false);
      onResult(data);
      return;
    } catch (error) {
      clearTimeout(localTimeout);
      console.warn("Local backend failed:", error.message);
      setStatusMessage("☁️ Local unavailable. Trying cloud backend...");

      // Try cloud with its own timeout
      const cloudTimeout = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, CLOUD_TIMEOUT_MS);

      try {
        const response = await fetch(`${FALLBACK_BASE_URL}/detect`, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
        clearTimeout(cloudTimeout);

        if (!response.ok) {
          throw new Error(`Cloud server error: ${response.status}`);
        }

        const data = await response.json();
        setLoading(false);
        setStatusMessage("☁️ Connected to cloud backend");
        setTimeout(() => setStatusMessage(""), 3000);
        onResult(data);
        return;
      } catch (fallbackError) {
        clearTimeout(cloudTimeout);
        console.error(fallbackError);
        setLoading(false);
        setStatusMessage("");
        alert("❌ Unable to reach both the local and cloud backends.");
      } finally {
        abortControllerRef.current = null;
      }
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

        {cameraOn && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                maxWidth: "450px",
                borderRadius: "12px",
              }}
            />
            <br />
            <br />
            <button onClick={capturePhoto}>📸 Capture</button>
            <button onClick={stopCamera} style={{ marginLeft: "10px" }}>
              ❌ Close
            </button>
            <br />
            <br />
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
