# İstanbul Mafia — Unity 2D MVP

Vampire Survivors tarzı top-down roguelike, Türk mafya teması. Bu doküman hem
Claude Code'un proje bağlamı, hem de senin MVP scope referansın.

**Kaynak:** HTML/JS prototipi `bgokayk/istanbul-mafia` (v6, 5758 satır tek HTML).
MVP için kapsam radikal ölçüde kısıldı. Kısılan özellikler v1.1+ için not
düşüldü, atılmadı.

---

## 1. Mimari İlkeler

1. **Data-driven.** Karakter/düşman/silah/skill statları `ScriptableObject`
   olacak. Kodda hardcoded sayı yok. Yeni bir düşman eklemek = yeni bir SO asset
   oluşturmak.
2. **Namespace.** `IstanbulMafia.Player`, `IstanbulMafia.Enemies`,
   `IstanbulMafia.Weapons`, `IstanbulMafia.Waves`, `IstanbulMafia.Skills`,
   `IstanbulMafia.UI`, `IstanbulMafia.Core`.
3. **Singleton yok.** `GameManager`, `WaveManager` gibi sistemler için
   ScriptableObject event channel veya dependency injection. Sahne değişiminde
   kırılmasın.
4. **Input System yeni asset.** `Input.GetKey` yasak. `PlayerInput` component +
   `InputActions` asset.
5. **Fizik:** `Rigidbody2D` (Kinematic) + `Collider2D`. Transform ile movement
   yasak.
6. **Object pooling zorunlu.** Mermi, düşman, XP orb, hasar text'i —
   hepsi pool'lu. Vampire Survivors için pool olmadan FPS çöker (ekranda 200+
   obje olacak).
7. **Magic number yasak.** Tüm balans sayıları SO içinde veya `Constants`
   statik sınıfında. Script içinde `25f * 1.3f` gibi şey yok.
8. **Her sistem ayrı PR/commit.** "Player controller + wave sistemi aynı
   anda" yok. Sırayla.

---

## 2. Karakter Statları (Unity'ye 1:1 taşınacak)

Kaynak: HTML satır 779-787. Kısaltmalar: `dmg` hasar, `spd` hareket hızı,
`hp` max can, `fr` ateş periyodu (saniye, düşük = hızlı), `ps` mermi hızı,
`pc` aynı anda çıkan mermi sayısı.

| Karakter  | Silah    | dmg | spd | hp  | fr   | ps | pc | Passive (MVP'de **yok**, v1.1)        |
|-----------|----------|-----|-----|-----|------|----|----|----------------------------------------|
| Polat     | Tabanca  | 45  | 2.3 | 100 | 0.75 | 7  | 1  | ❄ Vuruşta düşman -30% hız, 1 sn       |
| Çakır     | Bıçak    | 16  | 3.6 | 60  | 0.55 | 8  | 2  | 🗡 %25 kritik (2x hasar)               |
| Memati    | Molotov  | 20  | 2.5 | 110 | 1.00 | 5  | 1  | 🔥 Yangın hasarı +%30                 |
| Abdülhey  | Zar      | 24  | 2.7 | 70  | 0.90 | 6  | 1  | 🎰 Her vuruş 0.05x-3x rastgele hasar  |

**MVP'de** passive'ler kapalı. 4 karakter sadece statları farklı. V1.1'de
passive field'ı `CharacterData` SO'sunda `enum PassiveType` olacak.

**SO şablonu:** `CharacterData : ScriptableObject`
```
string characterId;
string displayName;
Sprite portrait, ingameSprite;
WeaponData startWeapon;
int maxHp;
float moveSpeed;
int baseDamage;
float fireInterval;      // fr
float projectileSpeed;   // ps
int projectileCount;     // pc
Color primaryColor, accentColor;
PassiveType passive;     // v1.1 — MVP'de None
```

---

## 3. Düşman Statları (MVP: 4 düşman)

Kaynak: HTML satır 1392-1403. `r` çarpışma yarıçapı (pixel), `xp` drop, `gold`
drop.

| Düşman         | id   | hp  | spd | dmg | r  | xp | Rol            |
|----------------|------|-----|-----|-----|----|----|----------------|
| Çay Bardağı    | cay  | 12  | 2.2 | 4   | 8  | 2  | Yem, sürü      |
| Para Ruhu      | para | 30  | 1.4 | 6   | 12 | 12 | Orta, yavaş    |
| Halı Canavarı  | hali | 100 | 0.7 | 15  | 22 | 20 | Tank, yavaş    |
| Taksi Şoförü   | taksi| 70  | 2.2 | 12  | 18 | 18 | Orta, hızlı    |

**Spawn oranları** (HTML'de `spawnEnemy`, satır 3953):
- Çay Bardağı: ~%28 (ana sürü)
- Para Ruhu: her zaman açık, ~%10
- Halı Canavarı: 15. saniyeden sonra açık, ~%6
- Taksi Şoförü: 20. saniyeden sonra açık, ~%4

**Spawn mantığı:**
- Oyuncudan 380-580 pixel uzakta, rastgele açıda spawn
- Max ekrandaki düşman: 180
- Spawn hızı: her 0.5 saniyede 1 düşman (wave arttıkça düşer)

**Wave scaling:**
- `currentWave = Floor(elapsedSeconds / 18) + 1` (her 18 sn yeni dalga)
- HP çarpanı: `1 + wave * 0.15`
- Hız bonusu: `spd + wave * 0.018`
- Zorluk çarpanları: Easy 1.1x, Normal 1.3x, Hard 1.55x (MVP'de sadece Normal)

**SO şablonu:** `EnemyData : ScriptableObject`
```
string enemyId;
string displayName;
Sprite sprite;
int baseHp;
float baseSpeed;
int baseDamage;
float collisionRadius;
int xpDrop;
int goldDrop;
float unlockTime;        // saniye — bu süreden önce spawn olmaz
float spawnWeight;       // 0-1 arası ağırlık
```

---

## 4. Silahlar (MVP: 4 silah — Auto-fire)

Her silah `WeaponData` SO. Otomatik ateş = en yakın düşmanı hedefle, `fr`
aralığında `pc` kadar mermi at.

| Silah    | Interval (ms) | Davranış                                         |
|----------|---------------|--------------------------------------------------|
| Tabanca  | 900           | Düz mermi, tek hedef                             |
| Bıçak    | 500           | Düz, `pc=2` ile 2 bıçak ufak açıyla çıkar        |
| Molotov  | 2000          | Yavaş, düştüğü yerde 2 sn alev alanı (DoT)       |
| Zar      | 800           | Düz mermi, her vuruş hasarı oyundaki gibi rastgele olmayacak MVP'de — sabit dmg |

**MVP'de silah evrimi YOK.** Karakter başlangıç silahıyla oynar, sadece skill
kartlarıyla buff'lar.

**SO şablonu:** `WeaponData : ScriptableObject`
```
string weaponId;
GameObject projectilePrefab;
float baseInterval;
float baseRange;
WeaponBehaviour behaviour;  // enum: Straight, DualSpread, AreaDrop
AudioClip fireSound;
```

---

## 5. Level Up & Skill Kartları (MVP: 8 kart)

XP formülü (HTML incelemeden çıkarıldı, basitleştirildi):
- Level 1 → 2: 10 XP
- Her seviye: `nextLevelXP = prevLevelXP * 1.35`
- Level up olunca oyun durur, 3 rastgele kart sunulur, oyuncu seçer

**MVP'de 8 kart:**

| Kart            | Rarity | Etki                                        |
|-----------------|--------|---------------------------------------------|
| ❤ CAN           | Common | Max HP +%25, mevcut HP +20                  |
| 👟 HIZ          | Common | Move speed +0.5                             |
| 💥 HASAR        | Common | Damage +%30                                 |
| ⚡ HIZLI ATEŞ   | Common | Fire interval *0.72 (hızlanır)              |
| 🎯 ÇİFT ATIŞ    | Rare   | `projectileCount` +1                        |
| 🧲 MANYETİZMA   | Common | Pickup radius +80                           |
| 🔰 ZIRH         | Rare   | Alınan hasar -%20                           |
| 💫 BÜYÜK MERMİ  | Common | Mermi scale *1.5                            |

V1.1'de: Aura, Delici, Ateş/Buz/Patlayıcı mermi, Kan Çalma (21 karta genişler).

**SO şablonu:** `SkillCard : ScriptableObject`
```
string cardId;
string displayName;
string description;
Sprite icon;
Rarity rarity;           // enum Common/Rare/Epic
[SerializeField] SkillEffect effect;   // ISkillEffect interface
```

---

## 6. Oyuncu Statlarının Run-time Tutulması

`PlayerRuntimeStats` (MonoBehaviour, singleton değil):
- Tüm statlar base'den kopyalanır, skill kartları bunu mutasyona uğratır
- `OnStatChanged` event'i — UI bu event'i dinler

---

## 7. Scene Yapısı (MVP)

```
Scenes/
  00_Bootstrap.unity    // managers kurulumu, otomatik 01'e geçer
  01_MainMenu.unity     // karakter seç, başla
  02_Game.unity         // tek arena — Kapalıçarşı
  03_GameOver.unity     // sonuç, ana menüye dön
```

---

## 8. Dosya/Klasör Yapısı

```
Assets/_Project/
  Scripts/
    Core/           // GameManager, EventChannel, Constants
    Player/         // PlayerController, PlayerStats, PlayerAnimator
    Enemies/        // EnemyBase, EnemyMovement, EnemyHealth, EnemySpawner
    Weapons/        // WeaponBase, Projectile, WeaponAutoFire
    Skills/         // SkillCard SO, SkillEffect, LevelUpUI
    Waves/          // WaveManager
    UI/             // HUD, LevelUpPanel, GameOverPanel
    Pooling/        // ObjectPool<T>
  ScriptableObjects/
    Characters/     // 4 CharacterData asset
    Enemies/        // 4 EnemyData asset
    Weapons/        // 4 WeaponData asset
    Skills/         // 8 SkillCard asset
  Prefabs/
    Player/
    Enemies/
    Projectiles/
    UI/
    VFX/
  Scenes/
  Sprites/          // MVP'de placeholder — basit şekiller
  Audio/
```

---

## 9. Claude Code İlk Görev

Proje boş. Sıralı ilerleyeceğiz. Her adımda:
1. Ne yapacağını ve hangi dosyaları ekleyeceğini bana söyle
2. Onay al
3. Yap
4. Test adımlarını yaz (Unity Editor'de ne açacağım, ne tıklayacağım)
5. Bir sonraki adıma geçmeden dur

**Adım 1 — İskelet kur.**
- Yukarıdaki klasör yapısını Unity'de oluştur
- `Assembly Definition` dosyaları: her ana namespace için ayrı `.asmdef`
  (Core, Player, Enemies, Weapons, Skills, Waves, UI)
- `Constants.cs` (Core altında): `PLAYER_LAYER`, `ENEMY_LAYER`, `PROJECTILE_LAYER`
  tanımları — Unity Layer'larını da ekle
- Boş `00_Bootstrap` ve `02_Game` sahnelerini oluştur

**Adım 2 — `CharacterData` ScriptableObject.** Yukarıda §2'deki şablona göre.
4 karakter asset'ini oluştur, statları doldur. Henüz player controller yok.

**Adım 3 — Player Controller.** Sadece hareket (WASD + gamepad, Input System).
`Rigidbody2D` kinematic, `MovePosition` ile. Test için karakter = basit bir
daire sprite + color tint.

**Adım 4 — Kamera.** Cinemachine 2D, player'ı takip etsin, damped follow.

**Adım 5 — İlk düşman.** `EnemyData` SO + sadece Çay Bardağı spawn, oyuncuya
yürüsün (en basit AI — direkt çevir ve yürü). Çarpışınca hasar versin.

**Adım 6 — Auto-fire.** Polat'ın tabancasını implement et: en yakın düşmanı
bul, ona `fr` aralığında mermi at. Mermi pool'lu olacak. Düşmana değince
hasar.

**Adım 7 — Wave scaling + 3 düşman daha.** Para Ruhu, Halı, Taksi spawn'ları
ve zaman bazlı wave artışı.

**Adım 8 — XP orb + Level up UI + 3 skill kartı.** Önce HIZ, HASAR, HIZLI
ATEŞ. Sonra kalanları ekleriz.

**Adım 9 — Kalan 5 skill kartı + UI polish.**

**Adım 10 — Game Over + restart akışı.**

Şimdi sadece **Adım 1'i** yap. Bitince dur, onay iste.

---

## 10. Gökay İçin Notlar

- Unity'de hiçbir şey `GameObject.Find("Player")` ile bulunmamalı.
  Referanslar `[SerializeField]` ile Inspector'dan atanır veya event channel
  üzerinden.
- ScriptableObject asset'lerini Project window'da oluşturmak için:
  `Assets/Create/IstanbulMafia/...` menüsü olacak. `[CreateAssetMenu]`
  attribute'u her data class'ında var.
- Test modunda HP/hasar sayıları çok önemli değil, hissiyat önemli. Prototipte
  sayıları Inspector'dan canlı değiştirip test et.
- Ka6an kanalından öğrendiğin her konuyu bu projede denemek için zorlama —
  oyun yapısı buna uymayabilir. Örneğin Ka6an muhtemelen eski Input'u
  gösterecek, biz yeniyi kullanıyoruz.

---

**Versiyon:** MVP-v0.1 | **Oluşturulma:** 2026-04-21
