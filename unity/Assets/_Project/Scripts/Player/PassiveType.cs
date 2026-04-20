namespace IstanbulMafia.Player
{
    /// <summary>
    /// Karakterlerin v1.1'de aktifleşecek özel pasif yetenekleri.
    /// MVP'de (v0.1) hepsi <see cref="None"/> olarak işaretlenir — pasifler
    /// çalışmaz, karakterler sadece base statlarıyla ayrışır.
    /// </summary>
    public enum PassiveType
    {
        /// <summary>Pasif yok (MVP varsayılanı).</summary>
        None = 0,

        /// <summary>Polat: Her vuruşta düşman -%30 hız (1 sn).</summary>
        SlowOnHit = 1,

        /// <summary>Çakır: %25 ihtimalle kritik (2x hasar).</summary>
        Critical = 2,

        /// <summary>Memati: Yangın/alev hasarı +%30.</summary>
        FireBonus = 3,

        /// <summary>Abdülhey: Her vuruş 0.05x-3x arası rastgele hasar.</summary>
        RandomDice = 4,
    }
}
