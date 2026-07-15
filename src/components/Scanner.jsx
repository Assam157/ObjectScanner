import { useState } from "react";

const API_URL = "https://YOUR-RENDER-BACKEND.onrender.com";

function Scanner({ onResult }) {

    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

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

                    Upload or capture an image.

                    Our AI detects

                    Chairs and Monitors instantly.

                </p>

            </div>

            <div className="card">

                <h2>

                    Upload Image

                </h2>

                <br />

                <input

                    type="file"

                    accept="image/*"

                    capture="environment"

                    onChange={handleFile}

                />

                <br />

                <br />

                {

                    selectedImage &&

                    <img

                        className="preview"

                        src={URL.createObjectURL(selectedImage)}

                        alt="Preview"

                    />

                }

                <br />

                <br />

                <button

                    onClick={scanImage}

                    disabled={loading}

                >

                    {

                        loading

                        ?

                        "Scanning..."

                        :

                        "🔍 Scan Image"

                    }

                </button>

            </div>

            <div className="card">

                <h2>

                    How it Works

                </h2>

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