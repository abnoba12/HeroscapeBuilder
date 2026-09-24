using HeroscapeBuilder.Server.Data.Entities.Shop;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>
/// Card shop tables. They all live in the "shop" schema (see DB/Shop.sql) to keep them apart from the game data in dbo.
/// </summary>
public partial class HsbDbContext
{
    private const string ShopSchema = "shop";

    public virtual DbSet<CardFormat> CardFormats { get; set; }

    public virtual DbSet<DiscountTier> DiscountTiers { get; set; }

    public virtual DbSet<ShippingOption> ShippingOptions { get; set; }

    public virtual DbSet<CreatorSetting> CreatorSettings { get; set; }

    public virtual DbSet<CustomerOrder> CustomerOrders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<StripeEvent> StripeEvents { get; set; }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CardFormat>(entity =>
        {
            entity.ToTable("card_format", ShopSchema);

            entity.HasKey(e => e.Code);
            entity.Property(e => e.Code).HasMaxLength(20);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.FilePurpose).HasMaxLength(100);
        });

        modelBuilder.Entity<DiscountTier>(entity =>
        {
            entity.ToTable("discount_tier", ShopSchema);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PercentOff).HasColumnType("decimal(5,2)");
        });

        modelBuilder.Entity<ShippingOption>(entity =>
        {
            entity.ToTable("shipping_option", ShopSchema);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<CreatorSetting>(entity =>
        {
            entity.ToTable("creator_setting", ShopSchema);

            entity.HasKey(e => e.Creator);
            entity.Property(e => e.Creator).HasMaxLength(450);
        });

        modelBuilder.Entity<CustomerOrder>(entity =>
        {
            entity.ToTable("customer_order", ShopSchema);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasMaxLength(450);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.DiscountPercent).HasColumnType("decimal(5,2)");

            entity.HasIndex(e => e.AccessKey, "UX_customer_order_AccessKey").IsUnique();
            entity.HasIndex(e => e.StripeCheckoutSessionId, "UX_customer_order_StripeCheckoutSessionId").IsUnique();

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_customer_order_AspNetUsers");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("order_item", ShopSchema);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FormatCode).HasMaxLength(20);
            entity.Property(e => e.FormatName).HasMaxLength(100);
            entity.Property(e => e.UnitName).HasMaxLength(200);
            entity.Property(e => e.Creator).HasMaxLength(450);

            entity.HasOne(d => d.Order)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_order_item_customer_order");
        });

        modelBuilder.Entity<StripeEvent>(entity =>
        {
            entity.ToTable("stripe_event", ShopSchema);

            entity.HasKey(e => e.EventId);
            entity.Property(e => e.EventId).HasMaxLength(255);
            entity.Property(e => e.EventType).HasMaxLength(100);
        });
    }
}
