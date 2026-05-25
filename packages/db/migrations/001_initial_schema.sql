-- 001_initial_schema.sql
-- Melody Home Merchandise – initial PostgreSQL schema
-- Requires PostgreSQL 15+ (gen_random_uuid() built-in, no pgcrypto needed)

BEGIN;


-- Enum types


CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'in_production',
    'dispatched',
    'delivered',
    'cancelled'
);

CREATE TYPE notification_channel AS ENUM (
    'whatsapp',
    'email'
);

CREATE TYPE notification_event AS ENUM (
    'confirmed',
    'production',
    'dispatched',
    'delivered'
);

CREATE TYPE notification_status AS ENUM (
    'queued',
    'sent',
    'failed'
);

CREATE TYPE corporate_inquiry_status AS ENUM (
    'new',
    'contacted',
    'quoted',
    'closed',
    'cancelled'
);

-- Reusable updated_at trigger


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- products

CREATE TABLE products (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    sku             VARCHAR(50)     NOT NULL,
    name            VARCHAR(255)    NOT NULL,
    description     TEXT,
    artisan_story   TEXT,
    category        VARCHAR(100)    NOT NULL,
    material        VARCHAR(255),
    hsn_code        VARCHAR(20)     NOT NULL,
    base_price      NUMERIC(12, 2)  NOT NULL CHECK (base_price > 0),
    mrp             NUMERIC(12, 2)  NOT NULL CHECK (mrp > 0),
    images          TEXT[]          NOT NULL DEFAULT '{}',
    lead_time_days  INTEGER         NOT NULL DEFAULT 7 CHECK (lead_time_days > 0),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT products_sku_key UNIQUE (sku)
);

CREATE INDEX idx_products_category  ON products (category);
CREATE INDEX idx_products_is_active ON products (is_active) WHERE is_active = TRUE;

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- product_variants

CREATE TABLE product_variants (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID            NOT NULL
                                    REFERENCES products (id)
                                    ON DELETE RESTRICT,
    sku         VARCHAR(50)     NOT NULL,
    colour      VARCHAR(100),
    size        VARCHAR(50),
    fragrance   VARCHAR(100),
    price       NUMERIC(12, 2)  NOT NULL CHECK (price > 0),
    mrp         NUMERIC(12, 2)  NOT NULL CHECK (mrp > 0),
    stock_note  TEXT,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT product_variants_sku_key UNIQUE (sku)
);

CREATE INDEX idx_product_variants_product_id ON product_variants (product_id);

CREATE TRIGGER trg_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- orders
--
-- idempotency_key: set to the Razorpay order_id at checkout creation.
-- The payment.captured webhook checks this column before writing any
-- order record, preventing duplicate processing on retried webhooks.


CREATE TABLE orders (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key     VARCHAR(255)    NOT NULL,
    customer_name       VARCHAR(255)    NOT NULL,
    customer_phone      VARCHAR(20)     NOT NULL,
    customer_email      VARCHAR(255),
    shipping_address    JSONB           NOT NULL,
    total_amount        NUMERIC(12, 2)  NOT NULL CHECK (total_amount > 0),
    gst_amount          NUMERIC(12, 2)  NOT NULL DEFAULT 0 CHECK (gst_amount >= 0),
    invoice_number      VARCHAR(100),
    status              order_status    NOT NULL DEFAULT 'pending',
    razorpay_order_id   VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    shiprocket_order_id VARCHAR(100),
    shiprocket_awb      VARCHAR(100),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT orders_idempotency_key_key UNIQUE (idempotency_key),
    CONSTRAINT orders_invoice_number_key  UNIQUE (invoice_number)
);

-- Queried on every webhook, every fulfilment dashboard load, every admin search
CREATE INDEX idx_orders_status              ON orders (status);
CREATE INDEX idx_orders_razorpay_payment_id ON orders (razorpay_payment_id);
CREATE INDEX idx_orders_razorpay_order_id   ON orders (razorpay_order_id);
CREATE INDEX idx_orders_shiprocket_awb      ON orders (shiprocket_awb);
CREATE INDEX idx_orders_customer_phone      ON orders (customer_phone);
CREATE INDEX idx_orders_created_at          ON orders (created_at DESC);

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- order_items
--
-- hsn_code is denormalised from Product at order time for GST
-- invoice compliance — the product's HSN may change later.

CREATE TABLE order_items (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID            NOT NULL
                                            REFERENCES orders (id)
                                            ON DELETE CASCADE,
    product_variant_id  UUID            NOT NULL
                                            REFERENCES product_variants (id)
                                            ON DELETE RESTRICT,
    quantity            INTEGER         NOT NULL CHECK (quantity > 0),
    unit_price          NUMERIC(12, 2)  NOT NULL CHECK (unit_price > 0),
    hsn_code            VARCHAR(20)     NOT NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id           ON order_items (order_id);
CREATE INDEX idx_order_items_product_variant_id ON order_items (product_variant_id);

-- notifications
--
-- UNIQUE (order_id, channel, event) prevents duplicate notifications
-- being queued for the same lifecycle event on the same order.
-- retry_count is incremented by the SQS consumer on each failed attempt.


CREATE TABLE notifications (
    id              UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID                    NOT NULL
                                                REFERENCES orders (id)
                                                ON DELETE CASCADE,
    channel         notification_channel    NOT NULL,
    event           notification_event      NOT NULL,
    status          notification_status     NOT NULL DEFAULT 'queued',
    retry_count     INTEGER                 NOT NULL DEFAULT 0,
    sent_at         TIMESTAMPTZ,
    error_message   TEXT,
    created_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    CONSTRAINT notifications_order_channel_event_key
        UNIQUE (order_id, channel, event)
);

CREATE INDEX idx_notifications_order_id ON notifications (order_id);
-- Partial index: retry worker only queries queued/failed rows
CREATE INDEX idx_notifications_pending  ON notifications (status, created_at)
    WHERE status IN ('queued', 'failed');

CREATE TRIGGER trg_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- corporate_inquiries

CREATE TABLE corporate_inquiries (
    id              UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name    VARCHAR(255)                NOT NULL,
    contact_name    VARCHAR(255)                NOT NULL,
    phone           VARCHAR(20)                 NOT NULL,
    email           VARCHAR(255)                NOT NULL,
    quantity        INTEGER                     NOT NULL CHECK (quantity > 0),
    budget          NUMERIC(12, 2)              CHECK (budget > 0),
    event_date      DATE,
    message         TEXT,
    status          corporate_inquiry_status    NOT NULL DEFAULT 'new',
    created_at      TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ                 NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_corporate_inquiries_status     ON corporate_inquiries (status);
CREATE INDEX idx_corporate_inquiries_created_at ON corporate_inquiries (created_at DESC);

CREATE TRIGGER trg_corporate_inquiries_updated_at
    BEFORE UPDATE ON corporate_inquiries
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
