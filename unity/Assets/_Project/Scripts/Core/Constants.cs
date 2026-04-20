namespace IstanbulMafia.Core
{
    /// <summary>
    /// Oyun genelindeki sabit değerler. Balans sayıları burada DEĞIL — onlar
    /// ScriptableObject'lerde. Burada sadece layer index'leri, tag'ler, sahne
    /// isimleri gibi proje-yapısal sabitler.
    /// </summary>
    public static class Constants
    {
        /// <summary>
        /// Unity Layer index'leri. ProjectSettings/TagManager.asset ile eşleşmeli.
        /// Fizik filtreleme ve collision matrix için kullanılır.
        /// </summary>
        public static class Layers
        {
            public const int Player = 6;
            public const int Enemy = 7;
            public const int Projectile = 8;

            // Bit mask kullanımı için (LayerMask.GetMask() yerine)
            public const int PlayerMask = 1 << Player;
            public const int EnemyMask = 1 << Enemy;
            public const int ProjectileMask = 1 << Projectile;
        }

        /// <summary>
        /// Unity Tag'leri. ProjectSettings/TagManager.asset ile eşleşmeli.
        /// </summary>
        public static class Tags
        {
            public const string Player = "Player";
            public const string Enemy = "Enemy";
            public const string Projectile = "Projectile";
            public const string Pickup = "Pickup";
        }

        /// <summary>
        /// Sahne isimleri. Build Settings'deki sıra ile eşleşmeli.
        /// </summary>
        public static class Scenes
        {
            public const string Bootstrap = "00_Bootstrap";
            public const string MainMenu = "01_MainMenu";
            public const string Game = "02_Game";
            public const string GameOver = "03_GameOver";
        }
    }
}
