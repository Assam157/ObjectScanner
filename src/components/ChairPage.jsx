function ChairPage({ result, goHome }) {

    return (

        <div className="container">

            <div className="hero">

                <h1>

                    🪑 Chair Detected

                </h1>

                <p>

                    The AI successfully detected one or more chairs.

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

                    alt="Detected"

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

                    About Chairs

                </h2>

                <br />

                <p>

                    A chair is one of the most common pieces of furniture used
                    to support a seated person.

                    <br /><br />

                    Chairs are manufactured using wood,
                    plastic,
                    steel,
                    aluminium,
                    mesh,
                    fabric
                    and composite materials.

                    <br /><br />

                    Modern ergonomic chairs are designed to
                    reduce strain on the neck,
                    shoulders
                    and back.

                </p>

            </div>

            <div className="card">

                <h2>

                    Common Uses

                </h2>

                <br />

                <ul>

                    <li>Office Workstations</li>

                    <li>Schools & Universities</li>

                    <li>Dining Rooms</li>

                    <li>Hospitals</li>

                    <li>Airports</li>

                    <li>Restaurants</li>

                    <li>Waiting Lounges</li>

                </ul>

            </div>

            <div className="card">

                <h2>

                    Interesting Facts

                </h2>

                <br />

                <ul>

                    <li>✔ Ergonomic chairs reduce fatigue.</li>

                    <li>✔ Gaming chairs provide lumbar support.</li>

                    <li>✔ Office chairs support adjustable height.</li>

                    <li>✔ Mesh chairs improve airflow.</li>

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

export default ChairPage;