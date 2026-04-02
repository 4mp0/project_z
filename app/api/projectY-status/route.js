
let currentStatus = false;

export async function POST(req) {
  const body = await req.json();
  const { data } = body;

  if (data === 'ok') {
    currentStatus = true;

    return new Response(JSON.stringify({ message: 'Success!' }), {
      status: 200,
    });
  }

  currentStatus = false;

  return new Response(JSON.stringify({ message: 'Invalid' }), {
    status: 400,
  });
}

export async function GET() {
  return new Response(
    JSON.stringify({ status: currentStatus }),
    { status: 200 }
  );
}