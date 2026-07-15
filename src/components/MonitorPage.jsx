function MonitorPage({ result, goHome }) {

    return (

        <div className="container">

            <div className="hero">

                <h1>

                    🖥️ Monitor Detected

                </h1>

                <p>

                    The AI successfully detected a computer monitor.

                </p>

            </div>

            <div className="card">

                <h2>

                    Detection Result

                </h2>

                <br />

                <img

                    className="preview"

                    src={`data:image/jpeg;base64,${result.image}`}

                    alt="Detected Monitor"

                />

                <br />

                <br />

                <h2>

                    Confidence

                </h2>

                <h1
                    style={{
                        color: "#10b981"
                    }}
                >

                    {(result.confidence * 100).toFixed(2)}%

                </h1>

            </div>

            <div className="card">

                <h2>

                    About Computer Monitors

                </h2>

                <br />

                <p>

                    A monitor is an electronic display used to present
                    visual information from a computer.

                    <br /><br />

                    Modern monitors are available in LCD,
                    LED,
                    OLED,
                    Mini-LED
                    and Curved display technologies.

                    <br /><br />

                    Monitors are widely used in software development,
                    gaming,
                    education,
                    engineering,
                    medical imaging
                    and professional content creation.

                </p>

            </div>

            <div className="card">

                <h2>

                    Common Applications

                </h2>

                <br />

                <ul>

                    <li>Programming</li>

                    <li>Gaming</li>

                    <li>Video Editing</li>

                    <li>Graphic Design</li>

                    <li>Medical Diagnostics</li>

                    <li>Office Productivity</li>

                    <li>CAD & Engineering</li>

                </ul>

            </div>

            <div className="card">

                <h2>

                    Interesting Facts

                </h2>

                <br />

                <ul>

                    <li>✔ OLED monitors have individually lit pixels.</li>

                    <li>✔ IPS panels provide excellent colour accuracy.</li>

                    <li>✔ High refresh-rate monitors improve gaming.</li>

                    <li>✔ 4K monitors contain over 8 million pixels.</li>

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

                    🔍 Scan Another Image

                </button>

            </div>

        </div>

    );

}

export default MonitorPage;