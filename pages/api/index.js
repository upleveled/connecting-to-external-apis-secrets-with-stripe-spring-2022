export default async function handler(request, response) {
  response.status(200).json({ session: 'http://localhost:3000/session' });
}
