# מדריך תפריט צדדי נייד - ShiftIT

## סקירה כללית
התפריט הצדדי (Sidebar) באפליקציית ShiftIT עובד בשני מצבים:
- **Desktop (מסכים גדולים)**: תפריט קבוע בצד ימין
- **Mobile/Tablet (מסכים קטנים)**: תפריט drawer שנפתח/נסגר עם כפתור המבורגר

## תכונות

### כפתור המבורגר
- **מיקום**: צד ימין למעלה בראש העמוד (TopBar)
- **תצוגה**: מוצג רק במסכים קטנים (< 1024px)
- **אנימציה**: אפקט scale בעת לחיצה
- **צבע**: משתנה בהתאם לנושא (Light/Dark)

### התפריט הצדדי במובייל
- **אנימציה**: נכנס מצד ימין עם transition חלק (300ms)
- **Backdrop**: רקע אפלולי עם blur שמכסה את המסך
- **סגירה**: ניתן לסגור על ידי:
  1. לחיצה על כפתור X בתפריט
  2. לחיצה על ה-backdrop (רקע האפלולי)
  3. בחירת פריט מהתפריט
- **רוחב**: 256px (16rem)
- **Z-index**: 50 (מעל כל האלמנטים האחרים)

### התפריט הצדדי ב-Desktop
- **תצוגה**: תמיד גלוי
- **רוחב**: 256px (16rem)
- **מיקום**: ימין, קבוע
- **כפתור סגירה**: לא מוצג

## מבנה קוד

### App.tsx
```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);

// העברת ה-state ל-components
<Sidebar 
  isOpen={sidebarOpen}
  onToggle={() => setSidebarOpen(!sidebarOpen)}
  ...
/>

<TopBar 
  onMenuClick={() => setSidebarOpen(!sidebarOpen)}
  ...
/>
```

### Sidebar.tsx
- **Props**:
  - `isOpen`: האם התפריט פתוח (למובייל)
  - `onToggle`: פונקציה לסגירת/פתיחת התפריט
- **Logic**: סוגר אוטומטית את התפריט במובייל לאחר בחירת פריט

### TopBar.tsx
- **Props**:
  - `onMenuClick`: פונקציה שנקראת בלחיצה על כפתור ההמבורגר
- **Display**: כפתור המבורגר מוצג רק עם `lg:hidden`

## עיצוב וצבעים

### Dark Mode
- Background: `#0A1020`
- Border: `rgba(255, 255, 255, 0.10)`
- Text: `#FAFAFA`
- Backdrop: `rgba(0, 0, 0, 0.5)`

### Light Mode
- Background: `#FFFFFF`
- Border: `rgba(15, 23, 42, 0.1)`
- Text: `#0F172A`
- Backdrop: `rgba(0, 0, 0, 0.5)`

## Breakpoints
- **Mobile**: < 1024px (תפריט drawer)
- **Desktop**: ≥ 1024px (תפריט קבוע)

## אנימציות
- **Sidebar slide**: `transition-transform duration-300 ease-in-out`
- **Backdrop fade**: `animate-in fade-in duration-300`
- **Button press**: `active:scale-95`
- **Hover effects**: `transition-all duration-200`

## נגישות (Accessibility)
- כל הכפתורים כוללים `aria-label` בעברית
- התפריט ניתן לסגירה עם Escape (יכול להתווסף בעתיד)
- Focus management מטופל אוטומטית
- Backdrop למניעת אינטראקציה עם אלמנטים מאחורי התפריט
