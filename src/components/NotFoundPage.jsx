 function NotFoundPage({ goHome }) {

    return (

        <div className="container">

            <div className="hero">

                <h1>
                    ❌ No Supported Object Detected
                </h1>

                <p>
                    The AI could not confidently detect any supported object.
                </p>

            </div>

            <div className="card">

                <h2>Supported Objects</h2>

                <br />

                <ul>

                    <li>🪑 Chair</li>

                    <li>🖥️ Monitor</li>

                    <li>🔨 Hammer</li>

                    <li>✂️ Scissor</li>

                    <li>🥄 Spoon</li>

                </ul>

            </div>

            <div className="card">

                <h2>Possible Reasons</h2>

                <br />

                <ul>

                    <li>The image is blurry.</li>

                    <li>The object is partially hidden.</li>

                    <li>The object is too small.</li>

                    <li>The confidence score was below the threshold.</li>

                    <li>The object is not one of the supported classes.</li>

                </ul>

            </div>

            <div className="card">

                <h2>Tips for Better Detection</h2>

                <br />

                <ul>

                    <li>📷 Capture the complete object.</li>

                    <li>💡 Use good lighting.</li>

                    <li>📏 Move closer to the object.</li>

                    <li>🖼 Use a clear, high-resolution image.</li>

                    <li>🚫 Avoid blur and reflections.</li>

                </ul>

            </div>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "50px",
                    marginBottom: "50px"
                }}
            >

                <button onClick={goHome}>
                    🔄 Scan Another Image
                </button>

            </div>

        </div>

    );

}

export default NotFoundPage;
