function ScissorPage({ result, goHome }) {

    return (

        <div className="container">

            <div className="hero">

                <h1>
                    ✂️ Scissor Detected
                </h1>

                <p>
                    The AI successfully detected a pair of scissors.
                </p>

            </div>

            <div className="card">

                <h2>Detection Result</h2>

                <br />

                <img
                    className="preview"
                    src={`data:image/jpeg;base64,${result.image}`}
                    alt="Detected Scissor"
                />

                <br /><br />

                <h2>Confidence</h2>

                <h1 style={{ color: "#10b981" }}>
                    {(result.confidence * 100).toFixed(2)}%
                </h1>

            </div>

            <div className="card">

                <h2>About Scissors</h2>

                <br />

                <p>

                    Scissors are hand-operated cutting tools consisting of two
                    sharpened blades joined together at a pivot.

                    <br /><br />

                    They are commonly manufactured using stainless steel and
                    feature plastic, rubber, or metal handles for comfortable use.

                    <br /><br />

                    Specialized scissors are designed for tailoring, surgery,
                    gardening, crafts, and industrial applications.

                </p>

            </div>

            <div className="card">

                <h2>Common Uses</h2>

                <br />

                <ul>

                    <li>Cutting Paper</li>

                    <li>Arts & Crafts</li>

                    <li>Tailoring</li>

                    <li>Office Work</li>

                    <li>School Projects</li>

                    <li>Packaging</li>

                    <li>Medical Procedures</li>

                </ul>

            </div>

            <div className="card">

                <h2>Interesting Facts</h2>

                <br />

                <ul>

                    <li>✔ Scissors have existed for over 3,000 years.</li>

                    <li>✔ Stainless steel blades resist corrosion.</li>

                    <li>✔ Left-handed scissors have reversed blades.</li>

                    <li>✔ Professional tailoring scissors stay sharper longer.</li>

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
                    🔍 Scan Another Image
                </button>

            </div>

        </div>

    );

}

export default ScissorPage;
