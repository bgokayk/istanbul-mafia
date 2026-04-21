using UnityEngine;
using UnityEngine.InputSystem;

namespace IstanbulMafia.Player
{
    /// <summary>
    /// Oyuncunun hareketini yöneten controller. Input System'in
    /// <c>PlayerInput</c> komponenti "Send Messages" modunda bu class'taki
    /// <see cref="OnMove"/> metodunu otomatik çağırır.
    ///
    /// Rigidbody2D <b>Kinematic</b> olmalı. <see cref="Rigidbody2D.MovePosition"/>
    /// ile hareket ediyoruz — Transform.position kullanılmaz (fizik çarpışma
    /// algılaması için gerekli).
    /// </summary>
    [RequireComponent(typeof(Rigidbody2D))]
    [RequireComponent(typeof(PlayerRuntimeStats))]
    [DisallowMultipleComponent]
    public class PlayerController : MonoBehaviour
    {
        [Header("Görsel")]
        [SerializeField]
        [Tooltip("Karakterin sprite'ını tutan SpriteRenderer. Null ise otomatik aranır.")]
        private SpriteRenderer spriteRenderer;

        [SerializeField]
        [Tooltip("True ise ingameSprite ve primaryColor CharacterData'dan otomatik uygulanır.")]
        private bool applyCharacterVisualsOnStart = true;

        private Rigidbody2D _rb;
        private PlayerRuntimeStats _stats;
        private Vector2 _moveInput;

        private void Awake()
        {
            _rb = GetComponent<Rigidbody2D>();
            _stats = GetComponent<PlayerRuntimeStats>();

            if (spriteRenderer == null)
            {
                spriteRenderer = GetComponentInChildren<SpriteRenderer>();
            }
        }

        private void Start()
        {
            if (applyCharacterVisualsOnStart && _stats != null && _stats.BaseData != null)
            {
                ApplyCharacterVisuals();
            }
        }

        /// <summary>
        /// CharacterData'daki sprite ve renk bilgisini SpriteRenderer'a uygular.
        /// Sprite varsa olduğu gibi kullanır (renk = beyaz, tint yok);
        /// sprite yoksa placeholder olarak <see cref="CharacterData.primaryColor"/>
        /// tint uygular (başlangıç daire sprite'ı için).
        /// </summary>
        public void ApplyCharacterVisuals()
        {
            if (spriteRenderer == null || _stats?.BaseData == null) return;

            var data = _stats.BaseData;
            if (data.ingameSprite != null)
            {
                spriteRenderer.sprite = data.ingameSprite;
                spriteRenderer.color = Color.white; // Pixel art renklerini koru
            }
            else
            {
                // Sprite yok — placeholder daire sprite'ını karakter rengine boya
                spriteRenderer.color = data.primaryColor;
            }
        }

        // ─── Input System callback (PlayerInput Send Messages) ──────

        /// <summary>
        /// PlayerInput komponenti "Move" action'ı bu metoda iletir.
        /// Metod adı action adıyla eşleşmeli: "Move" → "OnMove".
        /// </summary>
        public void OnMove(InputValue value)
        {
            _moveInput = value.Get<Vector2>();
        }

        // ─── Fizik hareketi ──────────────────────────────────────────

        private void FixedUpdate()
        {
            if (_stats == null || !_stats.IsAlive) return;

            Vector2 delta = _moveInput * (_stats.MoveSpeed * Time.fixedDeltaTime);
            _rb.MovePosition(_rb.position + delta);
        }
    }
}
