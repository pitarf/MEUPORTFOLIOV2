/**
 * @file places-search.js
 * @description Serverless Function (Vercel) para busca em tempo real na Google Places API.
 * Busca advogados e escritórios de advocacia reais no Google Maps e filtra os que não possuem website.
 * Mantém a chave de API 100% segura no backend sem exposição no cliente frontend.
 */

export default async function handler(req, res) {
    // Configura headers de CORS caso necessário
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Chave GOOGLE_PLACES_API_KEY não configurada no ambiente do servidor.'
            });
        }

        // Obtém parâmetros da requisição (seja via GET query ou POST body)
        const params = req.method === 'POST' ? req.body : req.query;
        let query = (params.query || '').trim();
        const city = (params.city || '').trim();
        const state = (params.state || '').trim().toUpperCase();
        const onlyWithoutWebsite = params.onlyWithoutWebsite !== false && params.onlyWithoutWebsite !== 'false';
        const minRating = Number(params.minRating || 4.0);

        // Se a query não for fornecida explicitamente, compõe com inteligência geográfica
        if (!query) {
            if (city) {
                query = `advogado em ${city}${state ? ` ${state}` : ''}`;
            } else if (state) {
                query = `advogado em ${state}`;
            } else {
                query = 'advogados em São Paulo SP';
            }
        } else if (!query.toLowerCase().includes('advogad') && !query.toLowerCase().includes('advocacia')) {
            query = `advogado ${query}`;
        }

        const placesUrl = 'https://places.googleapis.com/v1/places:searchText';
        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,places.addressComponents'
        };

        // Queries paralelas inteligentes para maximizar o volume de escritórios sem site encontrados na cidade
        const queriesToRun = city ? [
            query,
            `escritorio de advocacia em ${city}${state ? ` ${state}` : ''}`,
            `advocacia em ${city}${state ? ` ${state}` : ''}`,
            `advogada em ${city}${state ? ` ${state}` : ''}`,
            `consultoria juridica em ${city}${state ? ` ${state}` : ''}`
        ] : [query];

        const searchPromises = queriesToRun.map(q =>
            fetch(placesUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    textQuery: q,
                    pageSize: 20
                })
            }).then(r => r.ok ? r.json() : { places: [] }).catch(() => ({ places: [] }))
        );

        const resultsArrays = await Promise.all(searchPromises);
        let rawPlaces = [];
        const seenIds = new Set();

        for (const resData of resultsArrays) {
            for (const place of (resData.places || [])) {
                if (place && place.id && !seenIds.has(place.id)) {
                    seenIds.add(place.id);
                    rawPlaces.push(place);
                }
            }
        }


// Higieniza nomes do Google Maps removendo poluição de SEO
function sanitizePlacesName(rawName) {
    if (!rawName || typeof rawName !== 'string') return 'Escritório de Advocacia';
    let name = rawName.trim();
    const separators = [' | ', ' - ', ' – ', ' — ', ' • ', ' / ', ': '];
    for (const sep of separators) {
        if (name.includes(sep)) {
            name = name.split(sep)[0].trim();
        }
    }
    if (name.includes('|')) name = name.split('|')[0].trim();
    if (name.includes('•')) name = name.split('•')[0].trim();
    name = name.replace(/\s*[-–—,]\s*(advogada?|advocacia|escritorio|consultoria|direito|juridico|oab).*$/i, '').trim();
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s\.]+\s+(advogada|advogado)$/i.test(name)) {
        name = name.replace(/\s+(advogada|advogado)$/i, '').trim();
    }
    name = name.replace(/\b(dra?)\b(?!\.)/i, (m) => (m.toLowerCase() === 'dra' ? 'Dra.' : 'Dr.'));
    name = name.replace(/\b(Dra|Dr)\s+\./gi, '$1.');
    name = name.replace(/[-–—/\\|:,;.]+$/, '').trim();
    return name || rawName;
}

        // Filtra e formata os dados
        const formattedLeads = rawPlaces
            .filter(place => {
                // Filtro 1: Apenas quem não tem website
                if (onlyWithoutWebsite && place.websiteUri) {
                    return false;
                }
                // Filtro 2: Avaliação mínima (se informada)
                if (place.rating && place.rating < minRating) {
                    return false;
                }
                return true;
            })
            .map(place => {
                const rawName = place.displayName?.text || 'Escritório de Advocacia';
                const name = sanitizePlacesName(rawName);
                const rawPhone = place.nationalPhoneNumber || place.internationalPhoneNumber || '';
                
                // Normaliza o número para o link do WhatsApp
                const cleanPhone = rawPhone.replace(/\D/g, '');
                let whatsappNumber = cleanPhone;
                if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
                    whatsappNumber = `55${cleanPhone}`;
                }

                // Extração inteligente de cidade e estado
                let detectedCity = city || '';
                let detectedState = state || '';

                if (place.addressComponents && Array.isArray(place.addressComponents)) {
                    const cityComp = place.addressComponents.find(c => 
                        c.types?.includes('administrative_area_level_2')
                    );
                    const stateComp = place.addressComponents.find(c => 
                        c.types?.includes('administrative_area_level_1')
                    );
                    if (cityComp) detectedCity = cityComp.longText || cityComp.shortText;
                    if (stateComp) detectedState = stateComp.shortText || stateComp.longText;
                }

                // Cria slug limpo para a landing page (incluindo cidade se disponível)
                const nameSlug = name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\b(dr|dra|doutor|doutora|advogado|advogada)\b/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');

                const citySlug = detectedCity
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');

                const fullSlug = citySlug ? `${nameSlug}-${citySlug}` : nameSlug;

                return {
                    id: `gplaces_${place.id}`,
                    place_id: place.id,
                    name: name,
                    lawyer_name: name,
                    raw_business_name: rawName,
                    specialty: 'Direito Geral e Consultoria',
                    city: detectedCity,
                    state: detectedState,
                    address: place.formattedAddress || `${detectedCity} - ${detectedState}`,
                    rating: place.rating || 5.0,
                    reviews_count: place.userRatingCount || 0,
                    has_website: false,
                    website: '',
                    phone: rawPhone,
                    whatsapp: whatsappNumber,
                    instagram: '',
                    google_maps_url: place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + (place.formattedAddress || ''))}`,
                    source: 'google_places_api',
                    slug: fullSlug,
                    landing_page_slug: fullSlug,
                    created_at: new Date().toISOString()
                };
            });

        return res.status(200).json({
            success: true,
            query: query,
            total_raw: rawPlaces.length,
            count: formattedLeads.length,
            data: formattedLeads
        });
    } catch (error) {
        console.error('[Handler Error places-search]:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno ao processar a busca no Google Places.',
            error: error.message
        });
    }
}
