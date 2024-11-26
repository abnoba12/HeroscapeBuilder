using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class HsbDbContext : IdentityDbContext<ApplicationUser>
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

    public virtual DbSet<ArmyCardStl> ArmyCardStls { get; set; }

    public virtual DbSet<Creator> Creators { get; set; }

    public virtual DbSet<Set> Sets { get; set; }

    public virtual DbSet<SetTerrain> SetTerrains { get; set; }

    public virtual DbSet<Terrain> Terrains { get; set; }

    public virtual DbSet<UserCard> UserCards { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ArmyCard>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("army_card_pkey");

            entity.ToTable("army_card", tb => tb.HasComment("A list of stats and abilities for each unit in Heroscape"));

            entity.HasIndex(e => e.Creator, "IX_army_card_Creator");

            entity.HasIndex(e => e.Set, "IX_army_card_Set");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StlFile).HasColumnName("STL_File");

            entity.HasOne(d => d.CreatorNavigation).WithMany(p => p.ArmyCards)
                .HasPrincipalKey(p => p.Creator1)
                .HasForeignKey(d => d.Creator)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("army_card_Creator_fkey");

            entity.HasOne(d => d.SetNavigation).WithMany(p => p.ArmyCards)
                .HasForeignKey(d => d.Set)
                .HasConstraintName("army_card_Set_fkey");
        });

        modelBuilder.Entity<ArmyCardAbility>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("army_card_abilites_pkey");

            entity.ToTable("army_card_abilities");

            entity.HasIndex(e => e.ArmyCardId, "IX_army_card_abilities_army_card_id");

            entity.Property(e => e.Id).HasColumnName("id");
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

            entity.HasIndex(e => e.ArmyCardId, "IX_army_card_files_army_card_id");

            entity.HasIndex(e => e.Parent, "IX_army_card_files_parent");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ArmyCardId).HasColumnName("army_card_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.FilePath).HasColumnName("file_path");
            entity.Property(e => e.FilePurpose).HasColumnName("file_purpose");
            entity.Property(e => e.Parent).HasColumnName("parent");

            entity.HasOne(d => d.ArmyCard).WithMany(p => p.ArmyCardFiles)
                .HasForeignKey(d => d.ArmyCardId)
                .HasConstraintName("army_card_files_army_card_id_fkey");

            entity.HasOne(d => d.ParentNavigation).WithMany(p => p.InverseParentNavigation)
                .HasForeignKey(d => d.Parent)
                .HasConstraintName("army_card_files_parent_fkey");
        });

        modelBuilder.Entity<ArmyCardStl>(entity =>
        {
            entity.ToTable("army_card_stl");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ArmyCardId).HasColumnName("army_card_id");
            entity.Property(e => e.LastUpdated)
                .HasColumnType("datetime")
                .HasColumnName("last_updated");
            entity.Property(e => e.StlUrl).HasColumnName("stl_url");

            entity.HasOne(d => d.ArmyCard).WithMany(p => p.ArmyCardStls)
                .HasForeignKey(d => d.ArmyCardId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_army_card_stl_army_card");
        });

        modelBuilder.Entity<Creator>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.Creator1 }).HasName("Creator_pkey");

            entity.ToTable("creator");

            entity.HasIndex(e => e.Creator1, "AK_creator_Creator").IsUnique();

            entity.HasIndex(e => e.Creator1, "Creator_Creator_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("id");
            entity.Property(e => e.Creator1).HasColumnName("Creator");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
        });

        modelBuilder.Entity<Set>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("set_pkey");

            entity.ToTable("set");

            entity.HasIndex(e => e.Creator, "IX_set_creator");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.Creator)
                .HasDefaultValue("Heroscape")
                .HasColumnName("creator");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.ReleaseDate).HasColumnName("release_date");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.UnitsInSet).HasColumnName("units_in_set");
            entity.Property(e => e.Wave).HasColumnName("wave");

            entity.HasOne(d => d.CreatorNavigation).WithMany(p => p.Sets)
                .HasPrincipalKey(p => p.Creator1)
                .HasForeignKey(d => d.Creator)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("set_creator_fkey");
        });

        modelBuilder.Entity<SetTerrain>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("set_terrain_pkey");

            entity.ToTable("set_terrain");

            entity.HasIndex(e => e.Set, "IX_set_terrain_set");

            entity.HasIndex(e => e.Terrain, "IX_set_terrain_terrain");

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

        modelBuilder.Entity<UserCard>(entity =>
        {
            entity.ToTable("user_cards");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasMaxLength(450);

            entity.HasOne(d => d.OwnedArmyCardNavigation)
                .WithMany(p => p.UserCards)
                .HasForeignKey(d => d.OwnedArmyCard)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_user_cards_user_cards");

            entity.HasOne(d => d.User)
                .WithMany(p => p.UserCards)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_user_cards_AspNetUsers");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
