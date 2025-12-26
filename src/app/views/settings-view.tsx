import { User, Bell, Lock, Globe, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

export function SettingsView() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        <h2 className="mb-6">הגדרות</h2>

        {/* Profile Section */}
        <div className="rounded-lg border border-card-border bg-card p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="mb-1">מיכל אברהם</h3>
              <p className="text-sm text-muted-foreground">michal@hospital.co.il</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors">
            עריכת פרופיל
          </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Notifications */}
          <div className="rounded-lg border border-card-border bg-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <h3>התראות</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1">התראות דחוף</div>
                  <div className="text-sm text-muted-foreground">
                    קבל/י התראות על שינויים דחופים במשמרות
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-accent peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1">בקשות החלפה</div>
                  <div className="text-sm text-muted-foreground">
                    התראה כשיש בקשות החלפה חדשות
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-accent peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1">תזכורות משמרת</div>
                  <div className="text-sm text-muted-foreground">
                    תזכורת לפני תחילת המשמרת
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-accent peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="rounded-lg border border-card-border bg-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <h3>שפה ואזור</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="mb-1">שפה</div>
                <select className="px-3 py-2 rounded-lg bg-input-background border border-border focus:border-primary focus:outline-none">
                  <option value="he">עברית</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="mb-1">אזור זמן</div>
                <select className="px-3 py-2 rounded-lg bg-input-background border border-border focus:border-primary focus:outline-none">
                  <option value="asia/jerusalem">ירושלים (GMT+2)</option>
                  <option value="europe/london">לונדון (GMT+0)</option>
                  <option value="america/new_york">ניו יורק (GMT-5)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="rounded-lg border border-card-border bg-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <h3>פרטיות ואבטחה</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <button className="w-full text-right px-4 py-3 rounded-lg hover:bg-accent transition-colors">
                שינוי סיסמה
              </button>
              <button className="w-full text-right px-4 py-3 rounded-lg hover:bg-accent transition-colors">
                אימות דו-שלבי
              </button>
              <button className="w-full text-right px-4 py-3 rounded-lg hover:bg-accent transition-colors">
                היסטוריית התחברויות
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-lg border border-card-border bg-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <h3>מראה</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1">{theme === 'dark' ? 'מצב כהה' : 'מצב בהיר'}</div>
                  <div className="text-sm text-muted-foreground">
                    לחץ להחלפה בין מצב כהה לבהיר
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <div className="w-11 h-6 bg-accent peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors">
            <LogOut className="w-5 h-5" />
            התנתקות
          </button>
        </div>
      </div>
    </div>
  );
}