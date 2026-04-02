
export async function GET() {
  try {
    const res = await fetch('https://projectz-swart.vercel.app/home'); 
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.log(error)
  }
}
