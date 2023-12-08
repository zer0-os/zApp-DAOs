import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CMC_API_KEY = Deno.env.get('CMC_API_KEY');

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers':
		'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
	if (req.method === 'OPTIONS') {
		return new Response('ok', {
			headers: corsHeaders,
		});
	}

	try {
		if (req.method !== 'GET') {
			throw new Error('Unsupported method');
		}

		const url = new URL(req.url);
		// get all query params
		const params = url.searchParams.toString();

		if (!params?.length) {
			throw new Error('No params provided - please check CMC API docs');
		}

		const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?${params}`;

		const res = await fetch(apiUrl, {
			headers: {
				'X-CMC_PRO_API_KEY': CMC_API_KEY,
			},
		});

		if (!res.ok) {
			console.error('CMC API returned an error', res);
			throw new Error('CMC API returned an error');
		}

		const body = await res.json();

		return new Response(JSON.stringify(body), {
			status: 200,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 400,
		});
	}
});
