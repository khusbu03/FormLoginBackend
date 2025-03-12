const { CUQ_API_KEY, CUQ_URL } = process.env;

async function urlShortener(req, res) {
  try {
    const { longUrl } = req.body;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: CUQ_API_KEY,
        action: "add",
        url: longUrl
      })
    };

    const response = await fetch(CUQ_URL, options);
    if (!response.ok) throw new Error("Error occurred !");
    const data = await response.json();
    return res.status(200).json({
      ...data,
      success: true
    });
  } catch (error) {
    return res.status(500).send("Error occurred !");
  }
}

module.exports = urlShortener;
