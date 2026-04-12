export interface ProjectConfig {
    meta: {
        title: string;
    },

    banner: {
        bannerTextPlaceholder: string;
        defaultDescriptionText: string;
    },

    footer: {
        email: string;
        name: string;
    },

    header: {
        title: string;
    },

    publications: {
        nameToBold: string;
    },

    socialLinks: {
        placeholder: string;
    },

    firebaseConfig: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId: string;
    }
};

const changjinData: ProjectConfig = {
    meta: {
        title: "Changjin Ha",
    },

    banner: {
        bannerTextPlaceholder: "Changjin Ha",
        defaultDescriptionText: "Welcome to my personal website! I'm Changjin, a passionate software developer with a love for creating innovative solutions. This website serves as a portfolio of my projects, a blog where I share my thoughts on technology and programming, and a space to connect with like-minded individuals. Feel free to explore and reach out if you'd like to collaborate or just say hi!"
    },

    footer: {
        email: "ckdwls9460@gmail.com",
        name: "Changjin Ha"
    },

    header: {
        title: "Changjin Ha"
    },

    publications: {
        nameToBold: "Changjin Ha"
    },

    socialLinks: {
        placeholder: "@changjin_ha"
    },

    firebaseConfig: {
        apiKey: "AIzaSyCxeCggBfpXbT2iNNSduJ8k4qh0UxEyNbI",
        authDomain: "changjin-ha.firebaseapp.com",
        projectId: "changjin-ha",
        storageBucket: "changjin-ha.firebasestorage.app",
        messagingSenderId: "914785950236",
        appId: "1:914785950236:web:e0a2ed78acff6e18419dd9",
        measurementId: "G-KV8ZG8X88M"
    }
};

const yujeeData: ProjectConfig = {
    meta: {
        title: "Yujee Catherine",
    },

    banner: {
        bannerTextPlaceholder: "Yujee Chang",
        defaultDescriptionText: "Welcome to my personal website! I'm Yujee, a passionate software developer with a love for creating innovative solutions. This website serves as a portfolio of my projects, a blog where I share my thoughts on technology and programming, and a space to connect with like-minded individuals. Feel free to explore and reach out if you'd like to collaborate or just say hi!"
    },

    footer: {
        email: "cathycatherine312@gmail.com",
        name: "Yujee Catherine Chang"
    },

    header: {
        title: "Yujee Catherine"
    },

    publications: {
        nameToBold: "Yujee Chang"
    },

    socialLinks: {
        placeholder: "@yujee_chang"
    },
    
    firebaseConfig: {
        apiKey: "AIzaSyCJ10zXBvk1QYghtzMtw8Jke_Gay5AvYjU",
        authDomain: "yujee-catherine.firebaseapp.com",
        projectId: "yujee-catherine",
        storageBucket: "yujee-catherine.firebasestorage.app",
        messagingSenderId: "783183253911",
        appId: "1:783183253911:web:a7045a6c11d94b3616b4d2",
        measurementId: "G-1BNTWQ4540"
    }
}

const targetUser = import.meta.env.VITE_TARGET_USER;
export const CONFIG = targetUser === "changjin" ? changjinData : yujeeData;
