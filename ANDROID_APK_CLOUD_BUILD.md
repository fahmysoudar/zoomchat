# بناء APK من الموبايل باستخدام GitHub Actions

## الخطوات

### 1. إنشاء حساب GitHub
- افتح: https://github.com/signup
- سجّل بإيميلك واختر username وpassword
- فعّل الحساب من الإيميل

### 2. إنشاء Repository جديد
- اضغط على زر **+** في الأعلى
- اختر **New repository**
- اكتب اسم: `zoomchat-app`
- اختر **Private** (خاص)
- اضغط **Create repository**

### 3. رفع المشروع

#### طريقة 1: من Replit
- في Replit اضغط على الثلاث نقاط (...) بجانب Files
- اختر **Download as ZIP**
- فك الضغط على جهازك

#### طريقة 2: رفع الملفات
- في صفحة الـ Repository الجديد
- اضغط **uploading an existing file**
- ارفع كل ملفات المشروع (أو اسحبها)
- اضغط **Commit changes**

### 4. تشغيل GitHub Actions
- اذهب لتبويب **Actions** في الريبو
- لو طلب تفعيل: اضغط **I understand my workflows, go ahead and enable them**
- اضغط على **Build Android Debug APK**
- اضغط **Run workflow** ← **Run workflow**
- انتظر حتى تتحول العلامة لـ ✅ (حوالي 5-10 دقائق)

### 5. تنزيل APK
- اضغط على الـ workflow run الناجح (الأخضر)
- انزل لقسم **Artifacts**
- اضغط على **app-debug** لتحميل الـ ZIP
- فك الضغط وثبّت `app-debug.apk`

## ملاحظات
- الـ APK يعمل على أي جهاز Android
- قد تحتاج تفعيل "تثبيت من مصادر غير معروفة" في الإعدادات
- الـ workflow يشتغل تلقائياً مع كل push جديد

## مشاكل شائعة

### الـ Action فشل؟
- تأكد إن كل الملفات مرفوعة صح
- تأكد إن مجلد `android/` موجود
- تأكد إن ملف `capacitor.config.ts` موجود

### الـ APK مش شغال؟
- تأكد إن الموبايل متصل بالنت
- تأكد إن الموقع https://zoomchatlive.com شغال
