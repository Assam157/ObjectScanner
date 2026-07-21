import { useState } from "react";

// =============================================
// CONFIGURATION
// =============================================

// Automatically determine the local backend.
// - Laptop (localhost): http://localhost:5000
// - Phone on same Wi-Fi: http://<laptop-ip>:5000

const LOCAL_BASE_URL =
  process.env.REACT_APP_LOCAL_URL ||
  (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : `${window.location.protocol}//${window.location.hostname}:5000`
  );

// Hosted Render backend (fallback)
const FALLBACK_BASE_URL = "https://objectscannerbackend.onrender.com";

// Wait before falling back to cloud
const LOCAL_TIMEOUT_MS = 25000;

// =============================================

function Scanner({ onResult }) {

    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleFile = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);
    };

    const scanImage = async () => {

        if (!selectedImage) {

            alert("Please select an image first.");
            return;
        }

        setLoading(true);
        setStatusMessage("📡 Connecting to local backend...");

        const formData = new FormData();
        formData.append("image", selectedImage);

        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, LOCAL_TIMEOUT_MS);

        try {

            const response = await fetch(`${LOCAL_BASE_URL}/detect`, {
                method: "POST",
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Local server error: ${response.status}`);
            }

            const data = await response.json();

            setStatusMessage("");
            setLoading(false);

            onResult(data);

            return;

        } catch (error) {

            clearTimeout(timeoutId);

            console.warn("Local backend failed:", error.message);

            setStatusMessage("☁️ Local unavailable. Trying cloud backend...");

            try {

                const response = await fetch(`${FALLBACK_BASE_URL}/detect`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Cloud server error: ${response.status}`);
                }

                const data = await response.json();

                setLoading(false);

                setStatusMessage("☁️ Connected to cloud backend");

                setTimeout(() => {
                    setStatusMessage("");
                }, 3000);

                onResult(data);

                return;

            } catch (fallbackError) {

                console.error(fallbackError);

                setLoading(false);

                setStatusMessage("");

                alert("❌ Unable to reach both the local and cloud backends.");
            }
        }
    };

    return (

        <div className="container">

            <div className="hero">

                <h1>🧠 AI Object Scanner</h1>

                <p>
                    Upload or capture an image.
                    <br /><br />
                    Our AI detects Chairs and Monitors instantly.
                </p>

            </div>

            <div className="card">

                <h2>Upload Image</h2>

                <br />

                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                />

                <br />
                <br />

                {selectedImage && (

                    <img
                        className="preview"
                        src={URL.createObjectURL(selectedImage)}
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
                            marginBottom: "10px"
                        }}
                    >
                        {statusMessage}
                    </p>

                )}

                <button
                    onClick={scanImage}
                    disabled={loading}
                >

                    {loading ? "Scanning..." : "🔍 Scan Image"}

                </button>

            </div>

            <div className="card">

                <h2>How it Works</h2>

                <br />

                <p>

                    📷 Capture or upload an image

                    <br /><br />

                    🤖 YOLO detects the object

                    <br /><br />

                    📄 Information page opens automatically

                </p>

            </div>

        </div>

    );
}

export default Scanner;
