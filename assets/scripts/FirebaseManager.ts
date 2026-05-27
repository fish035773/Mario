declare const firebase: any;

const { ccclass, property } = cc._decorator;

@ccclass
export default class FirebaseManager extends cc.Component {

    public static instance: FirebaseManager = null;

    onLoad() {
        if (FirebaseManager.instance === null) {
            FirebaseManager.instance = this;
            cc.game.addPersistRootNode(this.node);
            this.loadFirebaseSDK();
        } else {
            this.node.destroy();
        }
    }

    private loadFirebaseSDK() {
        let appScript = document.createElement('script');
        appScript.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
        document.head.appendChild(appScript);

        let authScript = document.createElement('script');
        authScript.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js";
        document.head.appendChild(authScript);

        let dbScript = document.createElement('script');
        dbScript.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";
        document.head.appendChild(dbScript);

        dbScript.onload = () => {
            this.initFirebase();
        };
    }

    private initFirebase() {
        const firebaseConfig = {
            apiKey: "AIzaSyA1PHaXrS8ODXvdzS3WMtAaFlX2ycwjR-0",
            authDomain: "assignment2-bf0fd.firebaseapp.com",
            databaseURL: "https://assignment2-bf0fd-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "assignment2-bf0fd",
            storageBucket: "assignment2-bf0fd.firebasestorage.app",
            messagingSenderId: "1035651837873",
            appId: "1:1035651837873:web:72132c34540dcdfaed1790",
            measurementId: "G-LRH7NESESR"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            cc.log("🔥 Firebase 初始化成功！");
        }
    }

    public signUp(email: string, pass: string) {
        firebase.auth().createUserWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                cc.log("✅ 註冊成功！歡迎：", userCredential.user.email);
            })
            .catch((error) => {
                cc.error("❌ 註冊失敗：", error.message);
            });
    }

    public signIn(email: string, pass: string) {
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                cc.log("✅ 登入成功！歡迎回來：", userCredential.user.email);
            })
            .catch((error) => {
                cc.error("❌ 登入失敗：", error.message);
            });
    }

    public saveProgress() {
        let user = firebase.auth().currentUser;
        if (!user) {
            cc.warn("⚠️ 尚未登入，無法存檔！");
            return;
        }

        let saveData = {
            level: SceneManager.instance.currentLevel,
            score: SceneManager.instance.score,
            life: SceneManager.instance.life,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        let db = firebase.firestore();
        db.collection("users").doc(user.uid).set(saveData)
            .then(() => {
                cc.log("💾 雲端存檔成功！", saveData);
            })
            .catch((error) => {
                cc.error("❌ 存檔失敗：", error);
            });
    }

    public loadProgress() {
        let user = firebase.auth().currentUser;
        if (!user) return;

        let db = firebase.firestore();
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    let data = doc.data();
                    cc.log("📂 讀取存檔成功！", data);
                    
                    SceneManager.instance.currentLevel = data.level;
                    SceneManager.instance.score = data.score;
                    SceneManager.instance.life = data.life;

                    cc.director.loadScene(data.level);
                } else {
                    cc.log("沒有找到存檔紀錄，這是一個新帳號。");
                    SceneManager.instance.startLevel("Level1"); 
                }
            }).catch((error) => {
                cc.error("❌ 讀取失敗：", error);
            });
    }

    public getLeaderboard(callback: (data: any[]) => void) {
        let db = firebase.firestore();
        
        db.collection("users").orderBy("score", "desc").limit(10).get()
            .then((querySnapshot) => {
                let leaderboardData = [];
                querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    leaderboardData.push({
                        email: data.email || "Unknown",
                        score: data.score || 0
                    });
                });
                
                if (callback) callback(leaderboardData);
            })
            .catch((error) => {
                cc.error("❌ 排行榜讀取失敗：", error);
            });
    }
}