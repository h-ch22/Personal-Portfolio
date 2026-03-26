import { Link } from "@tanstack/react-router"
import { GraduationCapIcon, LaptopMinimalCheckIcon, NewspaperIcon, ShieldCheckIcon, SproutIcon, TrophyIcon } from "lucide-react";

export default function MenuDialog() {
    const MENU_LIST = [
        {
            name: "Education",
            to: "/education"
        },
        {
            name: "Publications",
            to: "/publications"
        },
        {
            name: "Projects",
            to: "/projects"
        },
        {
            name: "Certificates",
            to: "/certificates"
        },
        {
            name: "Awards",
            to: "/awards"
        },
        {
            name: "Experience",
            to: "/experience"
        }
    ];

    function getIcon(menu: string) {
        switch(menu) {
            case "Education":
                return <GraduationCapIcon />

            case "Publications":
                return <NewspaperIcon />

            case "Projects":
                return <LaptopMinimalCheckIcon />

            case "Certificates":
                return <ShieldCheckIcon />

            case "Awards":
                return <TrophyIcon />

            case "Experience":
                return <SproutIcon />
        }
    }

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            { MENU_LIST.map((menu) => (
                <Link to={menu.to} key={menu.name}>
                    <div className="flex flex-col justify-center text-foreground text-center items-center hover:underline">
                        { getIcon(menu.name) }
                        { menu.name }
                    </div>
                </Link>
            ))}
        </div>
    )
}