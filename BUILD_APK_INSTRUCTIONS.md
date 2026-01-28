# بناء APK لـ ZOOM Chat

## المتطلبات
1. Android Studio أو Android SDK (Command Line Tools)
2. Java JDK 17+
3. Node.js 18+

## الخطوات

### 1. حمّل المشروع
```bash
# من Replit: Download as ZIP أو Git clone
```

### 2. اضبط Android SDK
```bash
cd android
cp local.properties.example local.properties
# عدّل local.properties وضع مسار SDK الصحيح
```

### 3. ابنِ APK Debug
```bash
cd android
./gradlew assembleDebug
```

**مكان APK Debug:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 4. ابنِ APK Release (اختياري)

أولاً، أنشئ Keystore:
```bash
keytool -genkey -v -keystore zoomchat-release.keystore -alias zoomchat -keyalg RSA -keysize 2048 -validity 10000
```

أضف للـ `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("../zoomchat-release.keystore")
            storePassword "<PASSWORD>"
            keyAlias "zoomchat"
            keyPassword "<PASSWORD>"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

ثم ابنِ:
```bash
./gradlew assembleRelease
```

**مكان APK Release:**
```
android/app/build/outputs/apk/release/app-release.apk
```

## Checklist
- [ ] التطبيق يفتح ويدخل على /auth/login?source=pwa
- [ ] الـ manifest/web icons تحمّل بشكل صحيح
- [ ] لا يوجد Crash عند الإقلاع

## ملاحظات
- التطبيق يفتح الموقع مباشرة: https://zoomchatlive.com
- كل الـ API calls تذهب للسيرفر الحي
- WebView مضبوط على HTTPS فقط
