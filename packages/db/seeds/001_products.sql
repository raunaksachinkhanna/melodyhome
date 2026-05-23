-- 001_products.sql
-- Melody Home Merchandise – full product catalogue seed
-- Source: PRD Section 6.2 (20 SKUs, 13 parent products)
-- Safe to re-run: ON CONFLICT (sku) DO NOTHING

BEGIN;

-- ─────────────────────────────────────────────
-- Products (parent records, 13 rows)
-- ─────────────────────────────────────────────

INSERT INTO products (sku, name, category, hsn_code, base_price, mrp, lead_time_days)
VALUES
    -- Brass (ठठेरा craftwork)
    ('THA-COSTERS-HB', 'Brass Coasters',          'brass',   '7409',      799.00,  1100.00, 7),
    ('MH-FB',          'Flat Bowl Candle',          'brass',   '741999',   1350.00,  1650.00, 7),
    ('STRR-GLBR',      'Asva Stirrer',              'brass',   '7013',     1650.00,  1950.00, 7),
    ('MH-SNFR',        'Brass Snuffer',             'brass',   '7409',     1199.00,  1500.00, 7),
    ('MH-INCL',        'Brass Incense Holder',      'brass',   '7409',      799.00,   999.00, 7),
    ('MH-JARS',        'Thathera Jar',              'brass',   '7419',      560.00,   750.00, 7),

    -- Candles
    ('MH-LCAN',        'Ladoo Candle',              'candle',  '341310',    190.00,   250.00, 7),
    ('MH-CCAN',        'Coconut Cinnamon Candle',   'candle',  '341310',    600.00,   799.00, 7),
    ('MH-CGJAR',       'Cinnamon Glass Jar Candle', 'candle',  '341310',    585.00,   750.00, 7),
    ('MH-IHPB',        'Hot Pink Candle Jar',       'candle',  '341310',    699.00,   899.00, 7),
    ('MH-IHBB',        'Black Candle Jar',          'candle',  '341310',    699.00,   899.00, 7),

    -- Textiles
    ('MH-CBP',         'Camping Throw',             'textile', '63012000', 1699.00,  2499.00, 7),

    -- Growbags
    ('MH-GBAG',        'Growbag (Gamla)',            'growbag', '63079090',  599.00,   799.00, 7)

ON CONFLICT (sku) DO NOTHING;

-- ─────────────────────────────────────────────
-- Product Variants (20 rows, all 20 PRD SKUs)
-- product_id resolved via subselect on parent sku
-- ─────────────────────────────────────────────

INSERT INTO product_variants (product_id, sku, colour, size, fragrance, price, mrp)
VALUES
    -- Brass Coasters
    ((SELECT id FROM products WHERE sku = 'THA-COSTERS-HB'),
        'THA-COSTERS-HB-11', NULL, 'Set of 2',  NULL,                799.00,  1100.00),

    -- Flat Bowl Candle
    ((SELECT id FROM products WHERE sku = 'MH-FB'),
        'MH-FB-11',          NULL, 'Single',     NULL,               1350.00,  1650.00),

    -- Asva Stirrer
    ((SELECT id FROM products WHERE sku = 'STRR-GLBR'),
        'STRR-GLBR-11',      NULL, 'Set of 2',  NULL,               1650.00,  1950.00),

    -- Brass Snuffer (2 design variants)
    ((SELECT id FROM products WHERE sku = 'MH-SNFR'),
        'MH-SNFR-11',        'Butterfly',   'Single', NULL,          1199.00,  1500.00),
    ((SELECT id FROM products WHERE sku = 'MH-SNFR'),
        'MH-SNFR-12',        'Music Note',  'Single', NULL,          1199.00,  1500.00),

    -- Camping Throw (4 colour variants)
    ((SELECT id FROM products WHERE sku = 'MH-CBP'),
        'MH-CBP-BF-11',      'Brown Fawn',  NULL, NULL,              1699.00,  2499.00),
    ((SELECT id FROM products WHERE sku = 'MH-CBP'),
        'MH-CBP-GNB-11',     'Navy Green',  NULL, NULL,              1699.00,  2499.00),
    ((SELECT id FROM products WHERE sku = 'MH-CBP'),
        'MH-CBP-GRB-11',     'Grey Navy',   NULL, NULL,              1699.00,  2499.00),
    ((SELECT id FROM products WHERE sku = 'MH-CBP'),
        'MH-CBP-RB-11',      'Red Black',   NULL, NULL,              1699.00,  2499.00),

    -- Ladoo Candle (2 size variants)
    ((SELECT id FROM products WHERE sku = 'MH-LCAN'),
        'MH-LCAN-S4',        NULL, 'Set of 4',  NULL,                320.00,   400.00),
    ((SELECT id FROM products WHERE sku = 'MH-LCAN'),
        'MH-LCAN-S2',        NULL, 'Set of 2',  NULL,                190.00,   250.00),

    -- Coconut Cinnamon Candle
    ((SELECT id FROM products WHERE sku = 'MH-CCAN'),
        'MH-CCAN-11',        NULL, 'Single', 'Coconut Cinnamon',     600.00,   799.00),

    -- Cinnamon Glass Jar Candle
    ((SELECT id FROM products WHERE sku = 'MH-CGJAR'),
        'MH-CGJAR-11',       NULL, 'Single', 'Cinnamon',             585.00,   750.00),

    -- Hot Pink Candle Jar
    ((SELECT id FROM products WHERE sku = 'MH-IHPB'),
        'MH-IHPB-11',        'Hot Pink', 'Single', NULL,             699.00,   899.00),

    -- Black Candle Jar
    ((SELECT id FROM products WHERE sku = 'MH-IHBB'),
        'MH-IHBB-11',        'Black',    'Single', NULL,             699.00,   899.00),

    -- Brass Incense Holder
    ((SELECT id FROM products WHERE sku = 'MH-INCL'),
        'MH-INCL-11',        NULL, 'Single', NULL,                   799.00,   999.00),

    -- Thathera Jar (3 size variants)
    ((SELECT id FROM products WHERE sku = 'MH-JARS'),
        'MH-JARS-S',         NULL, '7x10cm', NULL,                   560.00,   750.00),
    ((SELECT id FROM products WHERE sku = 'MH-JARS'),
        'MH-JARS-M',         NULL, '8x11cm', NULL,                   750.00,   950.00),
    ((SELECT id FROM products WHERE sku = 'MH-JARS'),
        'MH-JARS-L',         NULL, '9x13cm', NULL,                   900.00,  1100.00),

    -- Growbag (Gamla)
    ((SELECT id FROM products WHERE sku = 'MH-GBAG'),
        'MH-GBAG-11',        NULL, 'Set of 3', NULL,                 599.00,   799.00)

ON CONFLICT (sku) DO NOTHING;

COMMIT;
