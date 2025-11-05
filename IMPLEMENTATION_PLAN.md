# 🚀 خطة تنفيذ البنية الجديدة

## 📋 ملخص التكرارات المكتشفة

### 🔴 الملفات المكررة:
1. **httpClient.js** - مكرر في مجلدين
2. **router.jsx** - مكرر في مجلدين  
3. **App.jsx** - مكرر في مجلدين
4. **utils/common.js** - مكرر في مجلدين
5. **auth.js** - مكرر في مجلدين

## 🎯 خطة التنفيذ المرحلية

### المرحلة 1: إنشاء الهيكل الجديد
```bash
# إنشاء المجلدات الجديدة
mkdir -p src/core/{entities,usecases,interfaces/repositories}
mkdir -p src/infrastructure/{api/{repositories,services},storage}
mkdir -p src/presentation/{components/{ui,forms,layout,common},pages/{auth,dashboard,hotels,touristSpots,cities,contacts,reviews,visas,settings,profile},hooks,contexts}
mkdir -p src/shared/{constants,utils,types,validators,config}
mkdir -p src/app
```

### المرحلة 2: دمج الملفات المكررة

#### 2.1 دمج httpClient
- **الاحتفاظ بـ**: `src/infrastructure/api/httpClient.js`
- **حذف**: `src/services/api/httpClient.js`
- **تحديث الاستيرادات** في جميع الملفات

#### 2.2 دمج router
- **الاحتفاظ بـ**: `src/app/router.jsx`
- **حذف**: `src/router.jsx`
- **تحديث**: `src/main.jsx` لاستيراد من `app/router`

#### 2.3 دمج App
- **الاحتفاظ بـ**: `src/app/App.jsx`
- **حذف**: `src/App.jsx`
- **تحديث**: `src/app/router.jsx` لاستيراد من `app/App`

#### 2.4 دمج utils/common.js
- **الاحتفاظ بـ**: `src/shared/utils/common.js`
- **حذف**: `src/utils/common.js`
- **تحديث الاستيرادات** في جميع الملفات

#### 2.5 دمج auth.js
- **الاحتفاظ بـ**: `src/shared/constants/auth.js`
- **حذف**: `src/constants/auth.js`
- **تحديث الاستيرادات** في جميع الملفات

### المرحلة 3: إعادة تنظيم المكونات

#### 3.1 نقل المكونات
```bash
# نقل المكونات الأساسية
mv src/components/AppBar src/presentation/components/layout/
mv src/components/Drawer src/presentation/components/layout/
mv src/components/ThemeToggle src/presentation/components/ui/
mv src/components/common/* src/presentation/components/common/
```

#### 3.2 نقل الصفحات
```bash
# نقل الصفحات
mv src/page/auth src/presentation/pages/
mv src/page/dashboard src/presentation/pages/
mv src/page/features src/presentation/pages/
mv src/page/Settings src/presentation/pages/settings
mv src/page/Profile src/presentation/pages/profile
mv src/page/services/* src/presentation/pages/
```

#### 3.3 نقل الخطافات والسياقات
```bash
# نقل الخطافات
mv src/presentation/hooks/* src/presentation/hooks/

# نقل السياقات
mv src/contexts/* src/presentation/contexts/
```

### المرحلة 4: إعادة تنظيم الخدمات

#### 4.1 نقل الخدمات
```bash
# نقل خدمات API
mv src/services/api/* src/infrastructure/api/services/
```

#### 4.2 تنظيم المستودعات
```bash
# نقل المستودعات
mv src/infrastructure/api/*Repository.js src/infrastructure/api/repositories/
```

### المرحلة 5: تنظيف الملفات القديمة

#### 5.1 حذف المجلدات الفارغة
```bash
# حذف المجلدات القديمة
rmdir src/components
rmdir src/page
rmdir src/contexts
rmdir src/services
rmdir src/utils
rmdir src/constants
```

#### 5.2 حذف الملفات المكررة
```bash
# حذف الملفات المكررة
rm src/services/api/httpClient.js
rm src/router.jsx
rm src/App.jsx
rm src/utils/common.js
rm src/constants/auth.js
```

## 🔧 خطوات التنفيذ التفصيلية

### الخطوة 1: إنشاء الهيكل الجديد
```bash
# تنفيذ الأوامر أعلاه لإنشاء المجلدات
```

### الخطوة 2: دمج httpClient
1. **فحص الاختلافات** بين الملفين
2. **اختيار النسخة الأفضل** (infrastructure/api/httpClient.js)
3. **تحديث جميع الاستيرادات**:
   ```bash
   # البحث عن جميع الاستيرادات
   grep -r "from.*services/api/httpClient" src/
   grep -r "import.*services/api/httpClient" src/
   ```
4. **استبدال الاستيرادات**:
   ```javascript
   // من
   import httpClient from '../services/api/httpClient';
   // إلى
   import httpClient from '../../infrastructure/api/httpClient';
   ```

### الخطوة 3: دمج router
1. **فحص الاختلافات** بين الملفين
2. **اختيار النسخة الأفضل** (app/router.jsx)
3. **تحديث main.jsx**:
   ```javascript
   // من
   import router from './router';
   // إلى
   import router from './app/router';
   ```

### الخطوة 4: دمج App
1. **فحص الاختلافات** بين الملفين
2. **اختيار النسخة الأفضل** (app/App.jsx)
3. **تحديث router.jsx**:
   ```javascript
   // من
   import App from './App';
   // إلى
   import App from './App';
   ```

### الخطوة 5: دمج utils/common.js
1. **فحص الاختلافات** بين الملفين
2. **اختيار النسخة الأفضل** (shared/utils/common.js)
3. **تحديث جميع الاستيرادات**:
   ```bash
   # البحث عن جميع الاستيرادات
   grep -r "from.*utils/common" src/
   grep -r "import.*utils/common" src/
   ```
4. **استبدال الاستيرادات**:
   ```javascript
   // من
   import { formatDate } from '../utils/common';
   // إلى
   import { formatDate } from '../../shared/utils/common';
   ```

### الخطوة 6: دمج auth.js
1. **فحص الاختلافات** بين الملفين
2. **اختيار النسخة الأفضل** (shared/constants/auth.js)
3. **تحديث جميع الاستيرادات**:
   ```bash
   # البحث عن جميع الاستيرادات
   grep -r "from.*constants/auth" src/
   grep -r "import.*constants/auth" src/
   ```
4. **استبدال الاستيرادات**:
   ```javascript
   // من
   import { isRoleAllowed } from '../constants/auth';
   // إلى
   import { isRoleAllowed } from '../../shared/constants/auth';
   ```

## 🧪 اختبار التطبيق

### بعد كل خطوة:
1. **تشغيل التطبيق**:
   ```bash
   npm run dev
   ```
2. **فحص الأخطاء** في وحدة التحكم
3. **اختبار الوظائف الأساسية**
4. **إصلاح أي أخطاء في الاستيرادات**

### اختبار شامل:
1. **اختبار جميع الصفحات**
2. **اختبار جميع النماذج**
3. **اختبار جميع الوظائف**
4. **فحص الأداء**

## 📊 قائمة التحقق

### ✅ المرحلة 1: إنشاء الهيكل
- [ ] إنشاء مجلدات core
- [ ] إنشاء مجلدات infrastructure
- [ ] إنشاء مجلدات presentation
- [ ] إنشاء مجلدات shared
- [ ] إنشاء مجلد app

### ✅ المرحلة 2: دمج الملفات المكررة
- [ ] دمج httpClient
- [ ] دمج router
- [ ] دمج App
- [ ] دمج utils/common.js
- [ ] دمج auth.js

### ✅ المرحلة 3: إعادة تنظيم المكونات
- [ ] نقل المكونات
- [ ] نقل الصفحات
- [ ] نقل الخطافات
- [ ] نقل السياقات

### ✅ المرحلة 4: إعادة تنظيم الخدمات
- [ ] نقل الخدمات
- [ ] تنظيم المستودعات

### ✅ المرحلة 5: تنظيف الملفات القديمة
- [ ] حذف المجلدات الفارغة
- [ ] حذف الملفات المكررة
- [ ] اختبار التطبيق

## 🎯 النتيجة المتوقعة

بعد تنفيذ هذه الخطة:
- **تقليل التكرار بنسبة 100%**
- **بنية واضحة ومنظمة**
- **سهولة الصيانة والتطوير**
- **كود أكثر تنظيماً**
- **أداء أفضل للتطبيق**

---

*هذه الخطة تضمن تنظيف المشروع بالكامل وإزالة جميع التكرارات مع الحفاظ على الوظائف.*
