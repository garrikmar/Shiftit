# מדריך עיצוב Light/Dark Mode - ShiftIT

## סקירה כללית
האפליקציה ShiftIT כוללת מערכת מלאה של Light Mode ו-Dark Mode עם מעבר חלק ביניהם.

## תכונות
- ✅ **Dark Mode כברירת מחדל** - האפליקציה נטענת במצב כהה
- ✅ **התאמה אוטומטית** - כל הקומפוננטים מתאימים את עצמם למצב הנוכחי
- ✅ **שמירה ב-localStorage** - ההעדפה נשמרת בין טעינות העמוד
- ✅ **2 מיקומים למעבר** - כפתור ב-TopBar ו-toggle בהגדרות
- ✅ **אנימציות חלקות** - מעברים חלקים בין הנושאים

## צבעים

### Dark Mode
- רקע ראשי: `#070A0F`
- רקע משני: `#0A1020`
- טקסט: `#FAFAFA` (לבן)
- Primary (Emerald): `#34D399`
- Secondary (Blue): `#60A5FA`
- Danger (Rose): `#FB7185`
- Warning (Amber): `#F59E0B`

### Light Mode
- רקע ראשי: `#F8FAFC`
- רקע משני: `#FFFFFF`
- טקסט: `#0F172A` (כהה)
- Primary (Emerald): `#10B981`
- Secondary (Blue): `#3B82F6`
- Danger (Rose): `#F43F5E`
- Warning (Amber): `#F59E0B`

## שימוש

### החלפת נושא מקוד
```tsx
import { useTheme } from "./contexts/theme-context";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      עבור ל-{theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

### קבלת מצב נושא נוכחי
```tsx
const { theme } = useTheme();
console.log(theme); // 'dark' or 'light'
```

## קבצים רלוונטיים
- `/src/app/contexts/theme-context.tsx` - React Context לניהול הנושא
- `/src/styles/theme.css` - הגדרות CSS Variables לשני הנושאים
- `/src/app/components/top-bar.tsx` - כפתור מעבר בין נושאים
- `/src/app/views/settings-view.tsx` - הגדרות נושא
- `/src/app/components/themed-toaster.tsx` - התראות מותאמות לנושא

## הוספת תמיכה לנושאים בקומפוננט חדש
כל קומפוננט שכבר משתמש ב-Tailwind classes כמו `bg-background`, `text-foreground`, וכו' יתאים את עצמו אוטומטית. אם צריך תנאי מותאם:

```tsx
import { useTheme } from "../contexts/theme-context";

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'specific-dark-style' : 'specific-light-style'}>
      תוכן
    </div>
  );
}
```
