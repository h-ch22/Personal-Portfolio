import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "#/lib/firebase";

export const fetchBannerImage = async () => {
    if(!storage) {
        return null;
    }

    const bannerRef = ref(storage, "banner/img_banner.png");

    try {
        const res = await getDownloadURL(bannerRef);
        return res;
    } catch(e: any) {
        throw e;
    }
}
