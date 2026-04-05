import { fetchBannerImage } from "#/api/banner/banner";
import { storage } from "#/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react"

const useHomeViewController = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const { data: bannerImage, isSuccess } = useQuery({
        queryKey: ["bannerImage"],
        queryFn: fetchBannerImage,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 30,
        enabled: typeof window !== "undefined" && !!storage
    })

    useEffect(() => {
        if(isSuccess) {
            setIsLoaded(true);

            const timer = setTimeout(() => {
                setShowContent(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isSuccess])

    return {
        isLoaded,
        bannerImage,
        showContent,
    }
}

export { useHomeViewController }
