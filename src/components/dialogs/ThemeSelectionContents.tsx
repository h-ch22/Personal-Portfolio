import type { Theme } from "#/types/theme";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function ThemeSelectionDialogContents({
    theme,
    setTheme
}: {
    theme: Theme,
    setTheme: (theme: Theme) => void
}) {
    const THEMES: Theme[] = [
        "System",
        "Light",
        "Dark",
    ];

    return (
        <div className="bg-background text-foreground p-4 flex flex-col justify-center items-center">
            <ToggleGroup type="single" size="lg" defaultValue={theme} variant="outline" onValueChange={(t) => setTheme(t as Theme)}>
                { THEMES.map((t) => (
                    <ToggleGroupItem key={t} value={t} className="h-fit py-2">
                        <div className="flex flex-col justify-center items-center">
                            { t === "System"
                                ? <>
                                    <div className="relative w-16 h-16 rounded-xl border-2 border-border overflow-hidden flex items-center justify-center shrink-0">
                                        <div className="absolute inset-0 bg-linear-to-br from-light-bg from-50% to-dark-bg to-50%"></div>
                                        <div className="relative z-10 w-6 h-6 rounded overflow-hidden border border-gray-400 shadow-sm">                                        
                                            <div className="w-full h-full bg-linear-to-br from-light-fg from-50% to-dark-fg to-50%"></div>
                                        </div>
                                    </div>
                                </>
                                : <>
                                    <div className="relative w-16 h-16 rounded-xl border-2 border-border overflow-hidden flex items-center justify-center shrink-0">
                                        <div className={`absolute inset-0 ${t === "Light" ? "bg-light-bg" : "bg-dark-bg"}`}></div>
                                        <div className={`relative z-10 font-semibold text-xl ${t === "Light" ? "text-light-fg" : "text-dark-fg"}`}>
                                            A
                                        </div>
                                    </div>
                                </>
                            }
                            { t }
                        </div>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    )
}