using System;
using UnityEngine;

namespace IstanbulMafia.Player
{
    /// <summary>
    /// Runtime'da mutasyona uğrayan oyuncu statları. <see cref="CharacterData"/>
    /// base'inden kopyalanır; skill kartları (Adım 8+) bu kopyayı değiştirir —
    /// CharacterData asset'i ASLA değişmez.
    ///
    /// UI bu instance'ı dinler (<see cref="OnStatsChanged"/> event'i).
    /// </summary>
    [DisallowMultipleComponent]
    public class PlayerRuntimeStats : MonoBehaviour
    {
        [SerializeField]
        [Tooltip("Karakter base stat asset'i. ScriptableObjects/Characters/ altında.")]
        private CharacterData baseData;

        /// <summary>
        /// Herhangi bir stat değiştiğinde tetiklenir. UI (HUD) bu event'i dinler.
        /// </summary>
        public event Action OnStatsChanged;

        // ─── Mutasyona uğrayan statlar ──────────────────────────────
        public int MaxHp { get; private set; }
        public int CurrentHp { get; private set; }
        public float MoveSpeed { get; private set; }
        public int Damage { get; private set; }
        public float FireInterval { get; private set; }
        public float ProjectileSpeed { get; private set; }
        public int ProjectileCount { get; private set; }

        /// <summary>Asset referansına salt-okunur erişim.</summary>
        public CharacterData BaseData => baseData;

        public bool IsAlive => CurrentHp > 0;

        private void Awake()
        {
            if (baseData == null)
            {
                Debug.LogError(
                    $"[{nameof(PlayerRuntimeStats)}] baseData atanmamış! Inspector'da " +
                    $"bir CharacterData asset'i bağlayın.", this);
                return;
            }

            InitializeFromBase();
        }

        /// <summary>
        /// Statları base asset'ten sıfırdan kopyalar. Ölüm + restart sırasında
        /// de çağrılabilir.
        /// </summary>
        public void InitializeFromBase()
        {
            MaxHp = baseData.maxHp;
            CurrentHp = baseData.maxHp;
            MoveSpeed = baseData.moveSpeed;
            Damage = baseData.baseDamage;
            FireInterval = baseData.fireInterval;
            ProjectileSpeed = baseData.projectileSpeed;
            ProjectileCount = baseData.projectileCount;
            OnStatsChanged?.Invoke();
        }

        // ─── Can yönetimi ───────────────────────────────────────────

        public void TakeDamage(int amount)
        {
            if (amount <= 0 || !IsAlive) return;
            CurrentHp = Mathf.Max(0, CurrentHp - amount);
            OnStatsChanged?.Invoke();
        }

        public void Heal(int amount)
        {
            if (amount <= 0 || !IsAlive) return;
            CurrentHp = Mathf.Min(MaxHp, CurrentHp + amount);
            OnStatsChanged?.Invoke();
        }
    }
}
