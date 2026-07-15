function SpoonPage({ result, goHome }) {

    return (

        <div className="container">

            <div className="hero">

                <h1>
                    🥄 Spoon Detected
                </h1>

                <p>
                    The AI successfully detected a spoon.
                </p>

            </div>

            <div className="card">

                <h2>Detection Result</h2>

                <br />

                <img
                    className="preview"
                    src={`data:image/jpeg;base64,${result.image}`}
                    alt="Detected Spoon"
                />

                <br /><br />

                <h2>Confidence</h2>

                <h1 style={{ color: "#10b981" }}>
                    {(result.confidence * 100).toFixed(2)}%
                </h1>

            </div>

            <div className="card">

                <h2>About Spoons</h2>

                <br />

                <p>

                    A spoon is a utensil primarily used for eating, stirring,
                    and serving food.

                    <br /><br />

                    Spoons are made from stainless steel, wood, plastic,
                    bamboo, and silver depending on their intended purpose.

                    <br /><br />

                    There are many varieties including teaspoons,
                    tablespoons, dessert spoons, soup spoons,
                    and serving spoons.

                </p>

            </div>

            <div className="card">

                <h2>Common Uses</h2>

                <br />

                <ul>

                    <li>Eating Meals</li>

                    <li>Serving Food</li>

                    <li>Cooking</li>

                    <li>Mixing Ingredients</li>

                    <li>Measuring Quantities</li>

                    <li>Desserts</li>

                    <li>Medical Syrups</li>

                </ul>

            </div>

            <div className="card">

                <h2>Interesting Facts</h2>

                <br />

                <ul>

                    <li>✔ Ancient spoons were made from shells and wood.</li>

                    <li>✔ Stainless steel spoons are highly durable.</li>

                    <li>✔ Different spoon sizes serve different purposes.</li>

                    <li>✔ The word "spoon" originates from an Old English term meaning chip of wood.</li>

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

export default SpoonPage;
