const frame = (id, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const PROPERTY_PHOTOS = {
  'monolith-villa': [
    {
      src: frame('1600596542815-ffad4c1539a9'),
      alt: 'Glass house beside a reflecting pool, shown for Monolith Villa',
    },
    {
      src: frame('1600607687939-ce8a6c25118c'),
      alt: 'Stone and glass living room, an interior of Monolith Villa',
    },
    {
      src: frame('1600566753190-17f0baa2a6c3'),
      alt: 'Pale stone kitchen, an interior of Monolith Villa',
    },
  ],
  'solstice-glass': [
    {
      src: frame('1600585154340-be6161a56a0c'),
      alt: 'Contemporary house in warm evening light, shown for Solstice Glass House',
    },
    {
      src: frame('1512917774080-9991f1c4c750'),
      alt: 'House opening onto a lawn and pool, shown for Solstice Glass House',
    },
    {
      src: frame('1600210492486-724fe5c67fb0'),
      alt: 'Sunlit living room, an interior of Solstice Glass House',
    },
  ],
  'helio-crown': [
    {
      src: frame('1564013799919-ab600027ffc6'),
      alt: 'Modern residence under a clear sky, shown for Helio Crown',
    },
    {
      src: frame('1600585152220-90363fe7e115'),
      alt: 'Upper-floor living room, an interior of Helio Crown',
    },
    {
      src: frame('1502672260266-1c1ef2d93688'),
      alt: 'Compact city living room, an interior of Helio Crown',
    },
  ],
  'lumina-loft': [
    {
      src: frame('1493809842364-78817add7ffb'),
      alt: 'Bright loft with tall windows, shown for Lumina Atrium Loft',
    },
    {
      src: frame('1560448204-e02f11c3d0e2'),
      alt: 'Open apartment living room, an interior of Lumina Atrium Loft',
    },
    {
      src: frame('1554995207-c18c203602cb'),
      alt: 'Double-height living space, an interior of Lumina Atrium Loft',
    },
  ],
  'aether-observatory': [
    {
      src: frame('1416331108676-a22ccb276e35'),
      alt: 'Modern house in a wide landscape, shown for Aether Observatory',
    },
    {
      src: frame('1479839672679-a46483c0e7c8'),
      alt: 'Angular modern house, shown for Aether Observatory',
    },
    {
      src: frame('1600573472592-401b489a3cdc'),
      alt: 'Quiet bedroom with a long view, an interior of Aether Observatory',
    },
  ],
  'neo-canopy-house': [
    {
      src: frame('1600047509358-9dc75507daeb'),
      alt: 'Courtyard house with a planted edge, shown for Canopy Court House',
    },
    {
      src: frame('1580587771525-78b9dba3b914'),
      alt: 'White house behind a lawn, shown for Canopy Court House',
    },
    {
      src: frame('1600566753086-00f18fb6b3ea'),
      alt: 'Kitchen opening toward a court, an interior of Canopy Court House',
    },
  ],
  'apex-slice': [
    {
      src: frame('1460317442991-0ec209397118'),
      alt: 'Residential stack with shared courts, shown for Apex Courtyard Slice',
    },
    {
      src: frame('1545324418-cc1a3fa10c00'),
      alt: 'Repeated residential towers, shown for Apex Courtyard Slice',
    },
    {
      src: frame('1487958449943-2429e8be8625'),
      alt: 'White structural block, shown for Apex Courtyard Slice',
    },
  ],
  'solaria-trust': [
    {
      src: frame('1570129477492-45c003edd2be'),
      alt: 'Low house with a broad roof, shown for Solaria Coast Trust',
    },
    {
      src: frame('1568605114967-8130f3a36994'),
      alt: 'Houses under trees, shown for Solaria Coast Trust',
    },
    {
      src: frame('1600210492493-0946911123ea'),
      alt: 'Sitting room in warm light, an interior for Solaria Coast Trust',
    },
  ],
  'twin-note': [
    {
      src: frame('1486325212027-8081e485255e'),
      alt: 'Cluster of glass towers, shown for Twin Structure Note',
    },
    {
      src: frame('1511818966892-d7d671e672a2'),
      alt: 'Repeating tower facade, shown for Twin Structure Note',
    },
    {
      src: frame('1448630360428-65456885c650'),
      alt: 'Concrete and glass structure, shown for Twin Structure Note',
    },
  ],
  'helio-exchange': [
    {
      src: frame('1497366216548-37526070297c'),
      alt: 'Long glass hall, shown for Helio Exchange Hall',
    },
    {
      src: frame('1497366811353-6870744d04b2'),
      alt: 'Glass-walled work floor, shown for Helio Exchange Hall',
    },
    {
      src: frame('1577495508048-b635879837f1'),
      alt: 'Commercial atrium, shown for Helio Exchange Hall',
    },
  ],
  'lumina-atelier': [
    {
      src: frame('1503387762-592deb58ef4e'),
      alt: 'Workrooms inside a concrete frame, shown for Lumina Atelier Block',
    },
    {
      src: frame('1515263487990-61b07816b324'),
      alt: 'Gallery-like interior, shown for Lumina Atelier Block',
    },
    {
      src: frame('1604014237800-1c9102c219da'),
      alt: 'Studio interior with timber and daylight, shown for Lumina Atelier Block',
    },
  ],
  'aether-archives': [
    {
      src: frame('1523217582562-09d0def993a6'),
      alt: 'Stone house at night, shown for Aether Archive Hall',
    },
    {
      src: frame('1449844908441-8829872d2607'),
      alt: 'Quiet house in a green field, shown for Aether Archive Hall',
    },
    {
      src: frame('1600121848594-d8644e57abab'),
      alt: 'Calm room in muted stone colors, an interior of Aether Archive Hall',
    },
  ],
};

export const DISTRICT_PHOTOS = {
  'neo-haven': {
    src: frame('1613977257363-707ba9348227'),
    alt: 'White villa with a long pool, the look of Neo Haven',
  },
  'solaria-coast': {
    src: frame('1602343168117-bb8ffe3e2e9f'),
    alt: 'Low pavilion among palms, the look of Solaria Coast',
  },
  'zenith-heights': {
    src: frame('1486406146926-c627a92ad1ab'),
    alt: 'Glass tower against the sky, the look of Zenith Heights',
  },
  'lumina-bay': {
    src: frame('1513584684374-8bab748fbf90'),
    alt: 'Rooms above the water, the look of Lumina Bay',
  },
  'aetheria-hills': {
    src: frame('1518780664697-55e3ad937233'),
    alt: 'Ridge house in open country, the look of Aetheria Hills',
  },
};

export function propertyPhotos(id) {
  return PROPERTY_PHOTOS[id] || [];
}

export function coverPhoto(id) {
  return propertyPhotos(id)[0] || null;
}

export function districtPhoto(id) {
  return DISTRICT_PHOTOS[id] || null;
}
