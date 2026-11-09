/**
 * @file places-search.js
 * @description Serverless Function (Vercel e Vite Dev Server) para busca em tempo real na Google Places API.
 * Busca estabelecimentos reais no Google Maps (Advogados, Dentistas, Hamburguerias, Barbearias, Psicólogos e Nutricionistas)
 * e filtra os que não possuem website próprio.
 * Mantém a chave de API 100% segura no backend sem exposição no cliente frontend.
 */

// Queries de busca especializadas por nicho
const NICHE_QUERIES = {
    dentista: [
        'dentista',
        'clinica odontologica',
        'consultorio odontologico',
        'ortodontia'
    ],
    hamburgueria: [
        'hamburgueria',
        'hamburgueria artesanal',
        'burger',
        'smash burger'
    ],
    barbearia: [
        'barbearia',
        'barber shop',
        'barbeiro'
    ],
    psicologo: [
        'psicologo',
        'psicologa',
        'consultorio de psicologia',
        'clinica de psicologia'
    ],
    nutricionista: [
        'nutricionista',
        'consultorio de nutricao',
        'clinica de nutricao'
    ],
    advocacia: [
        'advogado',
        'escritorio de advocacia',
        'advocacia',
        'advogada'
    ]
};

// Higieniza nomes do Google Maps removendo poluição de SEO
function sanitizePlacesName(rawName, niche = 'advocacia') {
    if (!rawName || typeof rawName !== 'string') return 'Estabelecimento Comercial';
    let name = rawName.trim();
    const separators = [' | ', ' - ', ' – ', ' — ', ' • ', ' / ', ': '];
    for (const sep of separators) {
        if (name.includes(sep)) {
            name = name.split(sep)[0].trim();
        }
    }
    if (name.includes('|')) name = name.split('|')[0].trim();
    if (name.includes('•')) name = name.split('•')[0].trim();

    // Limpeza específica de poluição de busca
    if (niche === 'advocacia') {
        name = name.replace(/\s*[-–—,]\s*(advogada?|advocacia|escritorio|consultoria|direito|juridico|oab).*$/i, '').trim();
        if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s\.]+\s+(advogada|advogado)$/i.test(name)) {
            name = name.replace(/\s+(advogada|advogado)$/i, '').trim();
        }
        name = name.replace(/\b(dra?)\b(?!\.)/i, (m) => (m.toLowerCase() === 'dra' ? 'Dra.' : 'Dr.'));
        name = name.replace(/\b(Dra|Dr)\s+\./gi, '$1.');
    } else if (niche === 'dentista') {
        name = name.replace(/\s*[-–—,]\s*(cro|ortodontia|implantes|odonto).*$/i, '').trim();
    } else if (niche === 'psicologo') {
        name = name.replace(/\s*[-–—,]\s*(crp|tcc|psicoterapia|terapia).*$/i, '').trim();
    }

    name = name.replace(/[-–—/\\|:,;.]+$/, '').trim();
    return name || rawName;
}

// Detecta o nicho a partir do nome ou da query caso o nicho seja 'todos'
function detectNiche(name, address = '', defaultNiche = 'advocacia') {
    if (defaultNiche && defaultNiche !== 'todos') return defaultNiche;
    const combined = `${name} ${address}`.toLowerCase();

    if (/\b(dentista|odonto|odontologia|sorriso|dente|ortodontia)\b/i.test(combined)) return 'dentista';
    if (/\b(burger|hamburguer|hamburgueria|smash|lanche|gastrobar)\b/i.test(combined)) return 'hamburgueria';
    if (/\b(barbearia|barber|navalha|corte masculino|barbeiro)\b/i.test(combined)) return 'barbearia';
    if (/\b(psicolog|psicoterapia|terapia|mente|emocional)\b/i.test(combined)) return 'psicologo';
    if (/\b(nutri|nutricao|nutricionista|alimentacao|dieta)\b/i.test(combined)) return 'nutricionista';
    return 'advocacia';
}

export default async function handler(req, res) {
    // Configura headers de CORS
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

        // Obtém parâmetros da requisição
        const params = req.method === 'POST' ? req.body : req.query;
        let query = (params.query || '').trim();
        const city = (params.city || '').trim();
        const state = (params.state || '').trim().toUpperCase();
        const niche = (params.niche || 'todos').toLowerCase();
        const onlyWithoutWebsite = params.onlyWithoutWebsite !== false && params.onlyWithoutWebsite !== 'false';
        const minRating = Number(params.minRating || 4.0);

        const placesUrl = 'https://places.googleapis.com/v1/places:searchText';
        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,places.addressComponents'
        };

        // Monta lista de termos de pesquisa baseado no nicho
        let queriesToRun = [];

        if (query) {
            queriesToRun = [query];
        } else if (niche && NICHE_QUERIES[niche]) {
            const terms = NICHE_QUERIES[niche];
            queriesToRun = terms.map(term => `${term} em ${city}${state ? ` ${state}` : ''}`);
        } else if (niche === 'todos') {
            // Busca os termos principais de cada nicho
            queriesToRun = [
                `dentista em ${city}${state ? ` ${state}` : ''}`,
                `hamburgueria em ${city}${state ? ` ${state}` : ''}`,
                `barbearia em ${city}${state ? ` ${state}` : ''}`,
                `psicologo em ${city}${state ? ` ${state}` : ''}`,
                `advogado em ${city}${state ? ` ${state}` : ''}`,
                `nutricionista em ${city}${state ? ` ${state}` : ''}`
            ];
        } else {
            queriesToRun = [`negócios em ${city}${state ? ` ${state}` : ''}`];
        }

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

        // Filtra e formata os dados
        const formattedLeads = rawPlaces
            .filter(place => {
                // Filtro 1: Apenas quem não tem website
                if (onlyWithoutWebsite && place.websiteUri) {
                    return false;
                }
                // Filtro 2: Avaliação mínima
                if (place.rating && place.rating < minRating) {
                    return false;
                }
                return true;
            })
            .map(place => {
                const rawName = place.displayName?.text || 'Estabelecimento';
                const detectedNiche = detectNiche(rawName, place.formattedAddress || '', niche);
                const name = sanitizePlacesName(rawName, detectedNiche);
                const rawPhone = place.nationalPhoneNumber || place.internationalPhoneNumber || '';
                
                // Normaliza o número para o link do WhatsApp
                const cleanPhone = rawPhone.replace(/\D/g, '');
                let whatsappNumber = cleanPhone;
                if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
                    whatsappNumber = `55${cleanPhone}`;
                }

                // Extração de cidade e estado
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

                // Cria slug amigável
                const nameSlug = name
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\b(dr|dra|doutor|doutora|advogado|advogada|clinica|consultorio|barbearia|hamburgueria)\b/g, '')
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
                    business_name: name,
                    lawyer_name: name,
                    raw_business_name: rawName,
                    niche: detectedNiche,
                    specialty: detectedNiche.charAt(0).toUpperCase() + detectedNiche.slice(1),
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
            niche: niche,
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
