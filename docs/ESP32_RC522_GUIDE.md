# Panduan Integrasi Hardware ESP32 + RC522 RFID

Dokumen ini menjelaskan cara merangkai modul RFID RC522 ke mikrokontroler ESP32 serta contoh source code Arduino IDE untuk mengirimkan UID kartu ke backend **HIMATIF Connect**.

---

## 1. Skema Pinout (ESP32 DevKit V1 & RC522)

| RC522 Pin | ESP32 GPIO | Keterangan |
|---|---|---|
| **3.3V / VCC** | 3V3 | **Wajib 3.3V** (Jangan 5V!) |
| **RST** | GPIO 22 | Reset Pin |
| **GND** | GND | Ground |
| **MISO** | GPIO 19 | SPI MISO |
| **MOSI** | GPIO 23 | SPI MOSI |
| **SCK** | GPIO 18 | SPI Clock |
| **SDA / SS** | GPIO 5 | SPI Chip Select |
| *(Opsional)* Buzzer (+) | GPIO 4 | Indikator Bunyi Beep |
| *(Opsional)* LED Hijau | GPIO 2 | Indikator Sukses |

---

## 2. Contoh Program Arduino C++ (ESP32)

Buka **Arduino IDE**, install library:
1. `MFRC522` by GithubCommunity
2. `ArduinoJson` by Benoit Blanchon (v6 atau v7)

```cpp
#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ----------------------------------------------------
// Konfigurasi Wi-Fi dan Server HIMATIF Connect
// ----------------------------------------------------
const char* ssid     = "NAMA_WIFI_ANDA";
const char* password = "PASSWORD_WIFI";

// Ganti dengan IP Address lokal komputer server backend
const char* serverUrl = "http://192.168.1.100:5000/api/rfid/scan";

// Pin RC522
#define RST_PIN  22
#define SS_PIN   5
#define BUZZER_PIN 4
#define LED_PIN    2

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  SPI.begin();
  mfrc522.PCD_Init();
  delay(10);
  mfrc522.PCD_DumpVersionToSerial();

  Serial.println("\n--- HIMATIF Connect: Menghubungkan ke Wi-Fi ---");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n[OK] Terhubung ke Wi-Fi!");
  Serial.print("IP Address ESP32: ");
  Serial.println(WiFi.localIP());
  Serial.println("Silakan dekatkan kartu RFID ke reader...\n");

  // Beep ganda saat siap
  digitalWrite(BUZZER_PIN, HIGH); delay(100); digitalWrite(BUZZER_PIN, LOW); delay(100);
  digitalWrite(BUZZER_PIN, HIGH); delay(100); digitalWrite(BUZZER_PIN, LOW);
}

void loop() {
  // Cek apakah ada kartu baru terdeteksi
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }

  // Format UID kartu menjadi string HEX (contoh: A3:7F:21:9C)
  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) {
      uidString += "0";
    }
    uidString += String(mfrc522.uid.uidByte[i], HEX);
    if (i < mfrc522.uid.size - 1) {
      uidString += ":";
    }
  }
  uidString.toUpperCase();

  Serial.print("\n[RFID Dideteksi] UID: ");
  Serial.println(uidString);

  // Kirim data UID ke Backend API
  sendUidToBackend(uidString);

  // Hentikan enkripsi dan pembacaan sementara kartu tersebut
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  // Jeda 1.5 detik sebelum scan berikutnya
  delay(1500);
}

void sendUidToBackend(String uid) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Error] Wi-Fi tidak terhubung!");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  // Siapkan payload JSON
  StaticJsonDocument<200> doc;
  doc["uid"] = uid;
  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.println("Mengirim ke server...");
  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("HTTP Status Code: ");
    Serial.println(httpResponseCode);
    Serial.print("Response: ");
    Serial.println(response);

    if (httpResponseCode == 200) {
      // Sukses absensi: Beep 1x panjang & LED Nyala
      digitalWrite(LED_PIN, HIGH);
      digitalWrite(BUZZER_PIN, HIGH);
      delay(200);
      digitalWrite(BUZZER_PIN, LOW);
      delay(800);
      digitalWrite(LED_PIN, LOW);
    } else if (httpResponseCode == 429) {
      // Cooldown / Sudah absen: Beep pendek 2x
      digitalWrite(BUZZER_PIN, HIGH); delay(80); digitalWrite(BUZZER_PIN, LOW); delay(80);
      digitalWrite(BUZZER_PIN, HIGH); delay(80); digitalWrite(BUZZER_PIN, LOW);
    } else {
      // Kartu tidak terdaftar / error: Beep 3x cepat
      for(int i=0; i<3; i++) {
        digitalWrite(BUZZER_PIN, HIGH); delay(60); digitalWrite(BUZZER_PIN, LOW); delay(60);
      }
    }
  } else {
    Serial.print("[Error] Gagal mengirim HTTP POST. Kode error: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}
```
