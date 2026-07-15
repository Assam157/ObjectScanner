 import { useEffect, useRef, useState } from "react";
 

const API_URL = "https://objectscannerbackend.onrender.com";

function Scanner({ onResult }) {

    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [cameraOn, setCameraOn] = useState(false);
    const [facingMode, setFacingMode] = useState("environment");

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const handleFile = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        stopCamera();

        setSelectedImage(file);

    };

    const stopCamera = () => {

        if (streamRef.current) {

            streamRef.current.getTracks().forEach(track => track.stop());

            streamRef.current = null;

        }

        if (videoRef.current) {

            videoRef.current.srcObject = null;

        }

        setCameraOn(false);

    };

    const startCamera = async () => {

        stopCamera();

        setSelectedImage(null);

        setCameraOn(true);

    };

    useEffect(() => {

        if (!cameraOn) return;

        const openCamera = async () => {

            try {

                const stream = await navigator.mediaDevices.getUserMedia({

                    video: {

                        facingMode: facingMode

                    },

                    audio: false

                });

                streamRef.current = stream;

                if (videoRef.current) {

                    videoRef.current.srcObject = stream;

                    await videoRef.current.play();

                }

            }

            catch (err) {

                console.error(err);

                alert("Unable to access camera.");

                stopCamera();

            }

        };

        openCamera();

        return () => {

            if (streamRef.current) {

                streamRef.current.getTracks().forEach(track => track.stop());

            }

        };

    }, [cameraOn, facingMode]);

    useEffect(() => {

        return () => stopCamera();

    }, []);

    const captureImage = () => {

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0);

        canvas.toBlob(

            (blob) => {

                if (!blob) return;

                const file = new File(

                    [blob],

                    "capture.jpg",

                    {

                        type: "image/jpeg"

                    }

                );

                setSelectedImage(file);

                stopCamera();

            },

            "image/jpeg",

            0.95

        );

    };

    const scanImage = async () => {

        if (!selectedImage) {

            alert("Please upload or capture an image first.");

            return;

        }

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append(

                "image",

                selectedImage

            );

            const response = await fetch(

                `${API_URL}/detect`,

                {

                    method: "POST",

                    body: formData

                }

            );

            const data = await response.json();

            setLoading(false);

            onResult(data);

        }

        catch (err) {

            console.error(err);

            setLoading(false);

            alert("Could not connect to backend.");

        }

    };

    return (

        <div className="container">

            <div className="hero">

                <h1>

                    🧠 AI Object Scanner

                </h1>

                <p>

                    Upload an image or use the live camera.

                </p>

            </div>

            <div className="card">

                <h2>

                    Upload or Capture

                </h2>

                <br />

                <input

                    type="file"

                    accept="image/*"

                    onChange={handleFile}

                />

                <br />

                <br />

                {

                    !cameraOn &&

                    <button

                        onClick={startCamera}

                    >

                        📷 Open Camera

                    </button>

                }

                {

                    cameraOn &&

                    <>

                        <br />

                        <br />

                        <video

                            ref={videoRef}

                            autoPlay

                            playsInline

                            muted

                            className="preview"

                            style={{

                                width: "100%",

                                maxWidth: "500px",

                                background: "#000",

                                borderRadius: "12px"

                            }}

                        />

                        <br />

                        <br />

                        <div

                            style={{

                                display: "flex",

                                gap: "10px",

                                justifyContent: "center",

                                flexWrap: "wrap"

                            }}

                        >

                            <button

                                onClick={captureImage}

                            >

                                📸 Capture

                            </button>

                            <button

                                onClick={() =>

                                    setFacingMode(

                                        prev =>

                                            prev === "environment"

                                                ? "user"

                                                : "environment"

                                    )

                                }

                            >

                                🔄 Switch Camera

                            </button>

                            <button

                                onClick={stopCamera}

                            >

                                ❌ Close

                            </button>

                        </div>

                    </>

                }

                <canvas

                    ref={canvasRef}

                    style={{

                        display: "none"

                    }}

                />

                {

                    selectedImage && !cameraOn &&

                    <>

                        <br />

                        <br />

                        <img

                            src={URL.createObjectURL(selectedImage)}

                            alt="Preview"

                            className="preview"

                        />

                    </>

                }

                <br />

                <br />

                <button

                    onClick={scanImage}

                    disabled={loading}

                >

                    {

                        loading

                            ? "Scanning..."

                            : "🔍 Scan Image"

                    }

                </button>

            </div>

            <div className="card">

                <h2>

                    How it Works

                </h2>

                <br />

                <p>

                    📷 Upload or capture an image.

                    <br /><br />

                    🤖 YOLO detects objects.

                    <br /><br />

                    📄 Information opens automatically.

                </p>

            </div>

        </div>

    );

}

export default Scanner;
