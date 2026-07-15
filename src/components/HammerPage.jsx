function HammerPage({ result, goHome }) {

    return (

        <div className="container">

            <div className="hero">

                <h1>
                    🔨 Hammer Detected
                </h1>

                <p>
                    The AI successfully detected a hammer.
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
                    alt="Detected Hammer"
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
                    About Hammers
                </h2>

                <br />

                <p>

                    A hammer is one of the oldest and most widely used hand
                    tools. It is designed for delivering impact to objects,
                    typically driving nails into wood or breaking materials.

                    <br /><br />

                    Hammers are commonly made from forged steel with wooden,
                    fiberglass or rubber-coated handles for durability and
                    comfortable grip.

                    <br /><br />

                    Different hammer types include claw hammers, ball-peen
                    hammers, sledgehammers and mallets, each suited for
                    different tasks.

                </p>

            </div>

            <div className="card">

                <h2>
                    Common Uses
                </h2>

                <br />

                <ul>

                    <li>Carpentry</li>

                    <li>Construction</li>

                    <li>Home Repairs</li>

                    <li>Furniture Assembly</li>

                    <li>Metalworking</li>

                    <li>Demolition Work</li>

                    <li>DIY Projects</li>

                </ul>

            </div>

            <div className="card">

                <h2>
                    Interesting Facts
                </h2>

                <br />

                <ul>

                    <li>✔ The claw hammer can both drive and remove nails.</li>

                    <li>✔ Steel heads are heat-treated for strength.</li>

                    <li>✔ Fiberglass handles absorb vibration.</li>

                    <li>✔ Hammers have been used by humans for thousands of years.</li>

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

export default HammerPage;
