namespace HeroscapeBuilder.Server.Data.Entities.Shop;

/// <summary>
/// Whether a creator's cards can be ordered (shop.creator_setting). Creators without a row are sellable.
/// </summary>
public partial class CreatorSetting
{
    public string Creator { get; set; } = null!;

    public bool IsSellable { get; set; }
}
