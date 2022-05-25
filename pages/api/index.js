export default async function handler(req, response) {
  response.status(200).json({ session: `http://${req.headers.host}/session` });
}
