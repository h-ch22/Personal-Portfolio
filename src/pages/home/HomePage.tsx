import { ScrollArea } from "#/components/ui/scroll-area"
import { useHomeViewController } from "./HomePage.lib";

import yujee from "#/assets/images/yujee.png";
import { Spinner } from "#/components/ui/spinner";

export default function HomePage() {
    const { 
        isLoaded,
        bannerImage,
        showContent
    } = useHomeViewController();

    return (
        <ScrollArea className="w-full min-h-screen">
            <div className="flex flex-col gap-4 overflow-hidden">
                <div className={`flex w-full h-screen items-center justify-center bg-primary transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    { isLoaded
                        ? <div className={`flex flex-col items-center gap-6 transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <img
                                src={bannerImage || yujee}
                                className="object-contain w-96 h-96"
                            />

                            <div className="w-full bottom-10 font-great-vibes text-7xl text-white text-center">
                                Yujee Chang
                            </div>
                        </div>
                        : <Spinner />
                    }

                </div>
                
                <div className="flex flex-col gap-4 bg-muted text-center py-4">
                    <div className="flex flex-row items-center w-full gap-2 text-4xl font-semibold justify-center text-foreground">
                        { "👋🏻 Hi there!" }
                    </div>
                    
                    <div className="flex flex-row items-center justify-center">
                        <img
                            src={yujee}
                            className="w-64" />
                    </div>
                    
                    <div className="text-muted-foreground">
                        { "Welcome to my personal website! I'm Yujee, a passionate software developer with a love for creating innovative solutions. This website serves as a portfolio of my projects, a blog where I share my thoughts on technology and programming, and a space to connect with like-minded individuals. Feel free to explore and reach out if you'd like to collaborate or just say hi!" }
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-secondary text-center py-4">
                    <div className="flex flex-row items-center w-full gap-2 text-4xl font-semibold justify-center text-foreground">
                        { "🫰🏻 Get in touch!" }
                    </div>
                    
                    
                </div>
            </div>
        </ScrollArea>
    )
}