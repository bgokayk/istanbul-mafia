# V2 piksel doku paketi

PNG dosyaları oyunda otomatik yüklenir. Düzenledikten sonra oyunu yenile; Android için `cap sync` ve yeniden derleme gerekir.

## Karakterler

`characters/<id>.png`: **96×32**, şeffaf PNG. Soldan sağa dört **24×32** kare. İlk kare duruş; diğerleri yürüyüş döngüsü. Bütün kareler sağa bakar; sola bakış kodda çevrilir. Ayak tabanı 30. satır çevresinde tutulur.

| Dosya | Karakter |
|---|---|
| kurt.png | KURT |
| ustura.png | USTURA |
| celik.png | ÇELİK |
| zarci.png | ZARCI |
| amca.png | AMCA |
| baba.png | BABA |
| abla.png | ABLA |
| sofor.png | ŞOFÖR |

## Zeminler

`tiles/<map-id>.png`: **512×64**, yan yana sekiz **64×64** kare. Zemin varyasyonu dünya koordinatından deterministik seçilir; kamera hareket ederken desen değişmez.

Kapalıçarşı, Üsküdar, Balat, Beşiktaş, Taksim, Eminönü, Galata, Kasımpaşa ve Bursa paletleri bulunur. Kapalı haritaların pakette bulunması oyunda açıldıkları anlamına gelmez.

## Düzenleme ilkeleri

Tam piksel ızgarasında çalış. Kenar yumuşatma ve bulanık gölge ekleme. Karakterler zeminden daha yüksek kontrastlı olmalı. Zemin ayrıntılarını düşük kontrastta tut. Boyutları değiştirme: yanlış boyutlu veya eksik dosyada oyun `art-v2.js` içindeki özgün çizime döner. Önbellek oturum boyunca tutulur; değişiklikten sonra yenileme gerekir.

Tezgâh, bina, varil, sütun ve düşman çizimleri `art-v2.js` içinde düzenlenir. Büyük menü portreleri bu paketin parçası değildir.
