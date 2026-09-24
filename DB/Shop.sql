/*
    Card shop feature - everything lives in its own "shop" schema so it stays separate from the game data in dbo.

    Idempotent: safe to run more than once.
    Run against the target database (e.g. HeroscapeBuilder_dev, then HeroscapeBuilder for prod).

    All money is stored as INT cents (USD) to avoid rounding issues. Stripe works in cents too.
    The seeded prices, turnaround times, discount tiers and shipping rates are PLACEHOLDERS - update them from the
    admin Shop Settings page once real costs are known.
*/

IF SCHEMA_ID(N'shop') IS NULL
    EXEC (N'CREATE SCHEMA shop AUTHORIZATION dbo;');
GO

-- A physical card format that can be ordered. FilePurpose links to dbo.army_card_files.file_purpose.
IF OBJECT_ID(N'shop.card_format', N'U') IS NULL
BEGIN
    CREATE TABLE shop.card_format
    (
        Code                NVARCHAR(20)    NOT NULL,
        Name                NVARCHAR(100)   NOT NULL,
        Description         NVARCHAR(1000)  NULL,
        FilePurpose         NVARCHAR(100)   NOT NULL,
        UnitPriceCents      INT             NOT NULL,
        -- Made-to-order: customers see an estimated production time instead of stock levels.
        TurnaroundMinDays   INT             NOT NULL,
        TurnaroundMaxDays   INT             NOT NULL,
        IsActive            BIT             NOT NULL CONSTRAINT DF_card_format_IsActive DEFAULT (1),
        SortOrder           INT             NOT NULL CONSTRAINT DF_card_format_SortOrder DEFAULT (0),

        CONSTRAINT PK_card_format PRIMARY KEY (Code),
        CONSTRAINT CK_card_format_UnitPriceCents CHECK (UnitPriceCents > 0),
        CONSTRAINT CK_card_format_Turnaround CHECK (TurnaroundMinDays >= 0 AND TurnaroundMaxDays >= TurnaroundMinDays)
    );

    CREATE UNIQUE INDEX UX_card_format_FilePurpose ON shop.card_format (FilePurpose);

    INSERT INTO shop.card_format (Code, Name, Description, FilePurpose, UnitPriceCents, TurnaroundMinDays, TurnaroundMaxDays, SortOrder)
    VALUES
        (N'Standard', N'Standard Card', N'Full-size army card, matching the original Heroscape card size.', N'Standard_Army_Card', 300, 10, 14, 1),
        (N'3x5', N'3x5 Index Card', N'Army card printed on a 3x5 index card.', N'3x5_Army_Card', 200, 5, 7, 2),
        (N'PC', N'Playing Card', N'Army card at standard playing-card size (2.5" x 3.5").', N'PC_Army_Card', 100, 3, 5, 3);
END;
GO

-- Quantity discounts apply to the TOTAL number of cards in the cart across all formats combined.
-- The highest tier whose MinQuantity is reached wins.
IF OBJECT_ID(N'shop.discount_tier', N'U') IS NULL
BEGIN
    CREATE TABLE shop.discount_tier
    (
        id           INT IDENTITY(1,1) NOT NULL,
        MinQuantity  INT               NOT NULL,
        PercentOff   DECIMAL(5,2)      NOT NULL,

        CONSTRAINT PK_discount_tier PRIMARY KEY (id),
        CONSTRAINT CK_discount_tier_MinQuantity CHECK (MinQuantity > 0),
        CONSTRAINT CK_discount_tier_PercentOff CHECK (PercentOff > 0 AND PercentOff < 100)
    );

    CREATE UNIQUE INDEX UX_discount_tier_MinQuantity ON shop.discount_tier (MinQuantity);

    INSERT INTO shop.discount_tier (MinQuantity, PercentOff)
    VALUES (25, 5), (100, 10), (200, 20);
END;
GO

-- Shipping choices offered on the Stripe checkout page.
IF OBJECT_ID(N'shop.shipping_option', N'U') IS NULL
BEGIN
    CREATE TABLE shop.shipping_option
    (
        id               INT IDENTITY(1,1) NOT NULL,
        Name             NVARCHAR(100)     NOT NULL,
        AmountCents      INT               NOT NULL,
        MinBusinessDays  INT               NOT NULL,
        MaxBusinessDays  INT               NOT NULL,
        IsActive         BIT               NOT NULL CONSTRAINT DF_shipping_option_IsActive DEFAULT (1),
        SortOrder        INT               NOT NULL CONSTRAINT DF_shipping_option_SortOrder DEFAULT (0),

        CONSTRAINT PK_shipping_option PRIMARY KEY (id),
        CONSTRAINT CK_shipping_option_AmountCents CHECK (AmountCents >= 0),
        CONSTRAINT CK_shipping_option_Days CHECK (MinBusinessDays > 0 AND MaxBusinessDays >= MinBusinessDays)
    );

    INSERT INTO shop.shipping_option (Name, AmountCents, MinBusinessDays, MaxBusinessDays, SortOrder)
    VALUES (N'Standard Shipping (USPS)', 500, 3, 7, 1);
END;
GO

-- Controls which creators' cards can be ordered. A creator with no row here is sellable.
IF OBJECT_ID(N'shop.creator_setting', N'U') IS NULL
BEGIN
    CREATE TABLE shop.creator_setting
    (
        Creator     NVARCHAR(450)  NOT NULL,
        IsSellable  BIT            NOT NULL,

        CONSTRAINT PK_creator_setting PRIMARY KEY (Creator)
    );
END;
GO

-- "order" is a reserved word, so the table is shop.customer_order.
IF OBJECT_ID(N'shop.customer_order', N'U') IS NULL
BEGIN
    CREATE TABLE shop.customer_order
    (
        id                       INT IDENTITY(1,1)  NOT NULL,
        -- Signed-in customers get the order linked to their account. Guest checkout leaves this NULL.
        UserId                   NVARCHAR(450)      NULL,
        -- Unguessable key for the order status link, so guests can check on their order without an account.
        AccessKey                UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_customer_order_AccessKey DEFAULT (NEWID()),
        Status                   NVARCHAR(20)       NOT NULL,

        -- Totals are calculated by the server when checkout starts. Shipping/tax/total are confirmed by Stripe on payment.
        CardCount                INT                NOT NULL,
        SubtotalCents            INT                NOT NULL,
        DiscountPercent          DECIMAL(5,2)       NOT NULL CONSTRAINT DF_customer_order_DiscountPercent DEFAULT (0),
        DiscountCents            INT                NOT NULL CONSTRAINT DF_customer_order_DiscountCents DEFAULT (0),
        ShippingCents            INT                NOT NULL CONSTRAINT DF_customer_order_ShippingCents DEFAULT (0),
        TaxCents                 INT                NOT NULL CONSTRAINT DF_customer_order_TaxCents DEFAULT (0),
        TotalCents               INT                NOT NULL,

        -- Filled from the Stripe checkout session once paid. No card data is ever stored here.
        Email                    NVARCHAR(256)      NULL,
        CustomerName             NVARCHAR(200)      NULL,
        Phone                    NVARCHAR(50)       NULL,
        ShipName                 NVARCHAR(200)      NULL,
        ShipLine1                NVARCHAR(200)      NULL,
        ShipLine2                NVARCHAR(200)      NULL,
        ShipCity                 NVARCHAR(100)      NULL,
        ShipState                NVARCHAR(100)      NULL,
        ShipPostalCode           NVARCHAR(20)       NULL,
        ShipCountry              NVARCHAR(2)        NULL,
        ShippingMethod           NVARCHAR(100)      NULL,

        StripeCheckoutSessionId  NVARCHAR(255)      NULL,
        StripePaymentIntentId    NVARCHAR(255)      NULL,

        Carrier                  NVARCHAR(50)       NULL,
        TrackingNumber           NVARCHAR(100)      NULL,
        -- Private notes for the shop owner; never shown to the customer.
        AdminNotes               NVARCHAR(MAX)      NULL,

        CreatedAt                DATETIME2          NOT NULL CONSTRAINT DF_customer_order_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt                DATETIME2          NOT NULL CONSTRAINT DF_customer_order_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        PaidAt                   DATETIME2          NULL,
        ShippedAt                DATETIME2          NULL,

        CONSTRAINT PK_customer_order PRIMARY KEY (id),
        CONSTRAINT FK_customer_order_AspNetUsers FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers (Id) ON DELETE SET NULL,
        CONSTRAINT CK_customer_order_Status CHECK (Status IN (N'Pending', N'Paid', N'InProduction', N'Shipped', N'Cancelled', N'Refunded', N'Expired')),
        CONSTRAINT CK_customer_order_CardCount CHECK (CardCount > 0)
    );

    CREATE UNIQUE INDEX UX_customer_order_AccessKey ON shop.customer_order (AccessKey);
    CREATE UNIQUE INDEX UX_customer_order_StripeCheckoutSessionId ON shop.customer_order (StripeCheckoutSessionId) WHERE StripeCheckoutSessionId IS NOT NULL;
    CREATE INDEX IX_customer_order_UserId ON shop.customer_order (UserId);
    CREATE INDEX IX_customer_order_Status ON shop.customer_order (Status, CreatedAt);
    CREATE INDEX IX_customer_order_StripePaymentIntentId ON shop.customer_order (StripePaymentIntentId);
END;
GO

-- One card file in a given format. Name, format and price are copied at order time so later catalog/price
-- changes never alter what the customer bought.
IF OBJECT_ID(N'shop.order_item', N'U') IS NULL
BEGIN
    CREATE TABLE shop.order_item
    (
        id               INT IDENTITY(1,1) NOT NULL,
        OrderId          INT               NOT NULL,
        ArmyCardFileId   BIGINT            NULL,
        -- Snapshot only (no FK) so army cards can still be edited or removed after they have been ordered.
        ArmyCardId       INT               NULL,
        FormatCode       NVARCHAR(20)      NOT NULL,
        FormatName       NVARCHAR(100)     NOT NULL,
        UnitName         NVARCHAR(200)     NOT NULL,
        Creator          NVARCHAR(450)     NULL,
        FilePath         NVARCHAR(MAX)     NULL,
        Quantity         INT               NOT NULL,
        UnitPriceCents   INT               NOT NULL,

        CONSTRAINT PK_order_item PRIMARY KEY (id),
        CONSTRAINT FK_order_item_customer_order FOREIGN KEY (OrderId) REFERENCES shop.customer_order (id) ON DELETE CASCADE,
        -- SET NULL so removing a card file from the catalog never deletes order history.
        CONSTRAINT FK_order_item_army_card_files FOREIGN KEY (ArmyCardFileId) REFERENCES dbo.army_card_files (id) ON DELETE SET NULL,
        CONSTRAINT CK_order_item_Quantity CHECK (Quantity > 0),
        CONSTRAINT CK_order_item_UnitPriceCents CHECK (UnitPriceCents > 0)
    );

    CREATE INDEX IX_order_item_OrderId ON shop.order_item (OrderId);
END;
GO

-- Stripe can deliver the same webhook more than once. Recording each processed event id makes handling idempotent.
IF OBJECT_ID(N'shop.stripe_event', N'U') IS NULL
BEGIN
    CREATE TABLE shop.stripe_event
    (
        EventId     NVARCHAR(255)  NOT NULL,
        EventType   NVARCHAR(100)  NOT NULL,
        ReceivedAt  DATETIME2      NOT NULL CONSTRAINT DF_stripe_event_ReceivedAt DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_stripe_event PRIMARY KEY (EventId)
    );
END;
GO

-- Open/closed switch for the whole shop (single row). New installs start CLOSED so nothing can be ordered until the
-- owner opens the shop from the admin Shop Settings page.
IF OBJECT_ID(N'shop.store_status', N'U') IS NULL
BEGIN
    CREATE TABLE shop.store_status
    (
        id             INT             NOT NULL CONSTRAINT DF_store_status_id DEFAULT (1),
        IsOpen         BIT             NOT NULL,
        -- Shown to customers while the shop is closed, e.g. "On vacation - back soon!"
        ClosedMessage  NVARCHAR(500)   NULL,
        -- Optional date shown to customers; the shop does not reopen by itself.
        ReopensOn      DATE            NULL,
        UpdatedAt      DATETIME2       NOT NULL CONSTRAINT DF_store_status_UpdatedAt DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT PK_store_status PRIMARY KEY (id),
        CONSTRAINT CK_store_status_SingleRow CHECK (id = 1)
    );

    INSERT INTO shop.store_status (id, IsOpen, ClosedMessage) VALUES (1, 0, N'The card shop is opening soon.');
END;
GO

-- Owner email notification tracking. OwnerNotifiedAt stays NULL until the "new order" email has actually been sent,
-- so a failed send is retried by the background check instead of being lost.
IF COL_LENGTH(N'shop.customer_order', N'OwnerNotifiedAt') IS NULL
    ALTER TABLE shop.customer_order ADD
        OwnerNotifiedAt  DATETIME2  NULL,
        NotifyAttempts   INT        NOT NULL CONSTRAINT DF_customer_order_NotifyAttempts DEFAULT (0);
GO
