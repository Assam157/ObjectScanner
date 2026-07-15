function NotFoundPage({ goHome }) {

    return (

        <div className="container">

            <div className="hero">

                <h1>

                    ❌ No Supported Object Detected

                </h1>

                <p>

                    The AI could not detect a Chair or a Monitor
                    in the uploaded image.

                </p>

            </div>

            <div className="card">

                <h2>

                    Possible Reasons

                </h2>

                <br />

                <ul>

                    <li>The image is blurry.</li>

                    <li>The object is partially hidden.</li>

                    <li>The object is too small.</li>

                    <li>The confidence score was below the threshold.</li>

                    <li>The uploaded object is not supported.</li>

                </ul>

            </div>

            <div className="card">

                <h2>

                    Tips for Better Detection

                </h2>

                <br />

                <ul>

                    <li>📷 Capture the entire object.</li>

                    <li>💡 Ensure good lighting.</li>

                    <li>📏 Move closer to the object.</li>

                    <li>🖼 Use a higher resolution image.</li>

                    <li>🚫 Avoid excessive blur or glare.</li>

                </ul>

            </div>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "50px",
                    marginBottom: "50px"
                }}
            >

                <button
                    onClick={goHome}
                >

                    🔄 Try Another Image

                </button>

            </div>

        </div>

    );

}

export default NotFoundPage;