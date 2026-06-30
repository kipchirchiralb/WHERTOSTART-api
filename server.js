    import express from "express";
    import cors from "cors";
    import dotenv from "dotenv";

    dotenv.config();

    const app = express();
    app.use(cors());
    app.use(express.json());

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const PORT = process.env.PORT || 3000;

    if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY in .env");
    process.exit(1);
    }

    app.get("/", (req, res) => {
    res.send("Gemini idea builder server is running.");
    });

    app.post("/idea", async (req, res) => {
    const { name, idea } = req.body;

    if (!name || !idea) {
        return res
        .status(400)
        .json({ error: "Missing name or idea in request body." });
    }

    const prompt = `You are an expert software architect and developer.

    The user details:
    - Name: ${name}
    - Idea: ${idea}

    Provide a complete plan to build this application, including:
    1) recommended platform and stack for a website or native app
    2) step-by-step development instructions
    3) deployment and hosting guidance to get it online

    Respond with clear sections and actionable guidance.`;

    try {
        const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
            },
            body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            }),
        },
        );

        if (!response.ok) {
        const details = await response.text();
        return res
            .status(response.status)
            .json({ error: "Gemini API request failed", details });
        }

        const data = await response.json();
        const instructions =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        JSON.stringify(data);

        return res.json({ name, idea, instructions });
    } catch (error) {
        console.error("Gemini request error:", error);
        return res.status(500).json({
        error: "Server error while contacting Gemini",
        details: error.message,
        });
    }
    });

    app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    });
