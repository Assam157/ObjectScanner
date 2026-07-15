 const scanImage = async () => {

    if (!selectedImage) {
        alert("Please upload or capture an image first.");
        return;
    }

    setLoading(true);

    try {

        const formData = new FormData();
        formData.append("image", selectedImage);

        const response = await fetch(`${API_URL}/detect`, {
            method: "POST",
            body: formData
        });

        console.log("HTTP Status:", response.status);

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server Error:", errorText);
            throw new Error(`Server Error (${response.status})`);
        }

        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Unexpected Response:", text);
            throw new Error("Backend did not return JSON.");
        }

        const data = await response.json();

        console.log("Backend Response:", data);

        if (!data.success) {
            throw new Error(data.message || "Detection failed.");
        }

        onResult(data);

    } catch (err) {

        console.error("Scan Error:", err);

        alert(err.message);

    } finally {

        setLoading(false);

    }

};
