using UnityEngine;

namespace IstanbulMafia.Player
{
    /// <summary>
    /// Bir oyuncu karakterinin tüm base statlarını ve görsel bilgisini tutan
    /// data asset. Runtime'da <c>PlayerRuntimeStats</c> bu veriyi kopyalar ve
    /// skill kartları o kopyayı mutasyona uğratır — orijinal asset değişmez.
    ///
    /// Asset oluşturmak için Project window'da:
    /// Create → Istanbul Mafia → Character Data
    ///
    /// Kaynak balans tablosu: <c>unity/CLAUDE.md §2</c> (HTML v6'dan birebir).
    /// </summary>
    [CreateAssetMenu(
        menuName = "Istanbul Mafia/Character Data",
        fileName = "NewCharacter",
        order = 1)]
    public class CharacterData : ScriptableObject
    {
        // ─── Identity ────────────────────────────────────────────────

        [Header("Identity")]
        [Tooltip("Kod tarafında karakteri tanımlayan benzersiz ID. Örn: polat, cakir, memati, abdulhey")]
        public string characterId;

        [Tooltip("Menüde ve HUD'da görünen isim. Örn: POLAT")]
        public string displayName;

        [Tooltip("Karakter seçim ekranındaki portre (büyük sprite).")]
        public Sprite portrait;

        [Tooltip("Oyun içinde karakterin kullandığı sprite.")]
        public Sprite ingameSprite;

        // ─── Weapon (Adım 4'te WeaponData SO referansına dönecek) ────

        [Header("Weapon (geçici)")]
        [Tooltip("Başlangıç silahı ID'si. MVP geçici — Adım 4'te WeaponData SO referansına dönecek. " +
                 "Geçerli değerler: tabanca, bicak, molotov, zar")]
        public string startWeaponId;

        // ─── Stats (HTML v6'dan 1:1) ─────────────────────────────────

        [Header("Base Stats")]
        [Tooltip("Maksimum can. Örn: Polat 100, Çakır 60, Memati 110, Abdülhey 70")]
        public int maxHp = 100;

        [Tooltip("Hareket hızı (birim/sn). Örn: Polat 2.3, Çakır 3.6, Memati 2.5, Abdülhey 2.7")]
        public float moveSpeed = 2.5f;

        [Tooltip("Temel hasar. Örn: Polat 45, Çakır 16, Memati 20, Abdülhey 24")]
        public int baseDamage = 20;

        [Tooltip("Ateş periyodu (saniye). Düşük = hızlı ateş. Örn: Polat 0.75, Çakır 0.55, Memati 1.00, Abdülhey 0.90")]
        public float fireInterval = 0.9f;

        [Tooltip("Mermi hızı (birim/sn). Örn: Polat 7, Çakır 8, Memati 5, Abdülhey 6")]
        public float projectileSpeed = 6f;

        [Tooltip("Aynı anda çıkan mermi sayısı. Örn: Polat 1, Çakır 2, Memati 1, Abdülhey 1")]
        public int projectileCount = 1;

        // ─── UI ──────────────────────────────────────────────────────

        [Header("UI Colors")]
        [Tooltip("Karakterin ana tema rengi (HUD accent, portre çerçevesi).")]
        public Color primaryColor = Color.white;

        [Tooltip("İkincil vurgu rengi (silah efekti, ulti barı).")]
        public Color accentColor = Color.gray;

        // ─── Passive (MVP'de devre dışı) ─────────────────────────────

        [Header("Passive (v1.1)")]
        [Tooltip("Karakterin özel pasifi. MVP v0.1'de hepsi None, v1.1'de aktifleşecek.")]
        public PassiveType passive = PassiveType.None;
    }
}
