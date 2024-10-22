using HeroscapeBuilder.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data;

public partial class HsbDbContext : DbContext
{
    public HsbDbContext()
    {
    }

    public HsbDbContext(DbContextOptions<HsbDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ArmyCard> ArmyCards { get; set; }

    public virtual DbSet<ArmyCardAbility> ArmyCardAbilities { get; set; }

    public virtual DbSet<ArmyCardFile> ArmyCardFiles { get; set; }

    public virtual DbSet<Creator> Creators { get; set; }

    public virtual DbSet<Set> Sets { get; set; }

    public virtual DbSet<SetTerrain> SetTerrains { get; set; }

    public virtual DbSet<Terrain> Terrains { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ArmyCard>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("army_card_pkey");

            entity.ToTable("army_card", tb => tb.HasComment("A list of stats and abilities for each unit in Heroscape"));

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.CreatorNavigation)
                .WithMany(p => p.ArmyCards)
                .HasPrincipalKey(p => p.CreatorName)
                .HasForeignKey(d => d.Creator)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("army_card_Creator_fkey");

            entity.HasOne(d => d.SetNavigation)
                .WithMany(p => p.ArmyCards)
                .HasForeignKey(d => d.Set)  // Use the correct column name here
                .HasConstraintName("army_card_Set_fkey");
        });

        modelBuilder.Entity<ArmyCardAbility>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("army_card_abilites_pkey");

            entity.ToTable("army_card_abilities");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("nextval('army_card_abilites_id_seq'::regclass)")
                .HasColumnName("id");
            entity.Property(e => e.Ability).HasColumnName("ability");
            entity.Property(e => e.AbilityName).HasColumnName("ability_name");
            entity.Property(e => e.ArmyCardId).HasColumnName("army_card_id");

            entity.HasOne(d => d.ArmyCard).WithMany(p => p.ArmyCardAbilities)
                .HasForeignKey(d => d.ArmyCardId)
                .HasConstraintName("army_card_abilities_army_card_id_fkey");
        });

        modelBuilder.Entity<ArmyCardFile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("army_card_files_pkey");

            entity.ToTable("army_card_files");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ArmyCardId).HasColumnName("army_card_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.FilePath).HasColumnName("file_path");
            entity.Property(e => e.FilePurpose).HasColumnName("file_purpose");

            entity.HasOne(d => d.ArmyCard).WithMany(p => p.ArmyCardFiles)
                .HasForeignKey(d => d.ArmyCardId)
                .HasConstraintName("army_card_files_army_card_id_fkey");

            entity.Property(e => e.ParentId)
                .HasColumnName("parent");

            entity.HasOne(e => e.Parent)
                .WithMany(e => e.Children)
                .HasForeignKey(e => e.ParentId) // Foreign key
                .HasConstraintName("army_card_files_parent_fkey")
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Creator>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.CreatorName }).HasName("Creator_pkey");

            entity.ToTable("creator");

            entity.HasIndex(e => e.CreatorName, "Creator_Creator_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("id");
            entity.Property(e => e.CreatorName).HasColumnName("Creator");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
        });

        modelBuilder.Entity<Set>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("set_pkey");

            entity.ToTable("set");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Creator)
                .HasDefaultValueSql("'Heroscape'::text")
                .HasColumnName("creator");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.ReleaseDate).HasColumnName("release_date");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.UnitsInSet).HasColumnName("units_in_set");
            entity.Property(e => e.Wave).HasColumnName("wave");

            entity.HasOne(d => d.CreatorNavigation).WithMany(p => p.Sets)
                .HasPrincipalKey(p => p.CreatorName)
                .HasForeignKey(d => d.Creator)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("set_creator_fkey");
        });

        modelBuilder.Entity<SetTerrain>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("set_terrain_pkey");

            entity.ToTable("set_terrain");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Set).HasColumnName("set");
            entity.Property(e => e.Terrain).HasColumnName("terrain");

            entity.HasOne(d => d.SetNavigation).WithMany(p => p.SetTerrains)
                .HasForeignKey(d => d.Set)
                .HasConstraintName("set_terrain_set_fkey");

            entity.HasOne(d => d.TerrainNavigation).WithMany(p => p.SetTerrains)
                .HasForeignKey(d => d.Terrain)
                .HasConstraintName("set_terrain_terrain_fkey");
        });

        modelBuilder.Entity<Terrain>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("terrain_pkey");

            entity.ToTable("terrain");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Hexes).HasColumnName("hexes");
            entity.Property(e => e.Type).HasColumnName("type");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
