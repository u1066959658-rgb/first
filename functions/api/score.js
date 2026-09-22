export async function onRequestPost(context) {
  const KEY = [1, 2, 0, 1, 0, 1, 0, 1, 2, 0];

  let body;
  try {
    body = await context.request.json();
  } catch (err) {
    return json({ error: "Invalid data." }, 400);
  }

  const answers = body && body.answers;
  if (!Array.isArray(answers) || answers.length !== KEY.length) {
    return json({ error: "Please answer all questions." }, 400);
  }

  const details = [];
  let score = 0;
  for (let i = 0; i < KEY.length; i++) {
    const chosen = Number(answers[i]);
    const correctIndex = KEY[i];
    const ok = chosen === correctIndex;
    if (ok) score += 1;
    details.push({
      question: i + 1,
      correct: ok,
      correctIndex: correctIndex
    });
  }

  const percent = score * 10;
  let comment = "Keep practicing.";
  if (score >= 9) comment = "Excellent work!";
  else if (score >= 7) comment = "Good result.";
  else if (score >= 5) comment = "You passed, but review the red answers.";

  return json({
    name: String((body && body.name) || ""),
    score: score,
    total: KEY.length,
    percent: percent,
    comment: comment,
    details: details
  });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
