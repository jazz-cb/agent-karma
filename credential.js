// Save this with .mjs extension (request.mjs) or add "type": "module" to package.json
const userEmail = "richard@gmail.com";
const templateId = "1ceb57b0-b156-4be6-9a81-d01a79428ae4";

const credentialParams = {
    recipient: `email:${userEmail}:polygon-amoy`,
    credential: {
        subject: {
            course: "Bullish",
            grade: "USDC",
        },
        expiresAt: "2034-02-02",
    },
};

const options = {
    method: "POST",
    headers: {
        "X-API-KEY": "sk_staging_5vVLPo9rzGh7mmJRgzxUKJYakZAGwfXqjtq6EtKXnbtk4w48axCAxpEjxKNFWyY5digedQYSqwYMigWzUP6DvpJG4LMmEv3dsyUowBzVwPwSHQUSGkEGbbWGWg1isTPE8GaHoChJ2JXPYwbhbvLy8aUBoP5Ht8Nu5XTLuUqeqBpyzG3YQC1FmGqArQsUdB7Ar34dBE81ZNT5XdWR1wuQZigj",
        "Content-Type": "application/json",
    },
    body: JSON.stringify(credentialParams),
};

// Using async/await for cleaner error handling
async function makeRequest() {
    try {
        const response = await fetch(
            `https://staging.crossmint.com/api/v1-alpha1/credentials/templates/${templateId}/vcs`, 
            options
        );
        const data = await response.json();
        console.log(JSON.stringify(data));
    } catch (err) {
        console.error(err);
    }
}

makeRequest();