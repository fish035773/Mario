import FirebaseManager from "./FirebaseManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AuthUI extends cc.Component {

    @property(cc.EditBox)
    emailInput: cc.EditBox = null;

    @property(cc.EditBox)
    passwordInput: cc.EditBox = null;

    @property(cc.Label)
    statusLabel: cc.Label = null;

    // ⭐ 新增：抓取三個按鈕的節點，用來控制顯示/隱藏
    @property(cc.Node)
    loginButton: cc.Node = null;

    @property(cc.Node)
    signUpButton: cc.Node = null;

    @property(cc.Node)
    logoutButton: cc.Node = null;

    onLoad() {
        cc.director.on("AuthStateChanged", this.updateStatusUI, this);
    }

    onDestroy() {
        cc.director.off("AuthStateChanged", this.updateStatusUI, this);
    }

    private updateStatusUI(email: string) {
        if (!this.statusLabel) return;

        let isLoggedIn = (email !== null); // 判斷是否為登入狀態

        if (isLoggedIn) {
            this.statusLabel.string = "目前登入：" + email;
        } else {
            this.statusLabel.string = "尚未登入";
        }

        // ⭐ 根據登入狀態，一鍵切換所有 UI 的顯示與隱藏
        if (this.emailInput) this.emailInput.node.active = !isLoggedIn;
        if (this.passwordInput) this.passwordInput.node.active = !isLoggedIn;
        if (this.loginButton) this.loginButton.active = !isLoggedIn;
        if (this.signUpButton) this.signUpButton.active = !isLoggedIn;
        if (this.logoutButton) this.logoutButton.active = isLoggedIn;
    }

    public onLoginClicked() {
        let email = this.emailInput.string;
        let pass = this.passwordInput.string;
        
        if (email === "" || pass === "") {
            cc.warn("請輸入帳號和密碼！");
            return;
        }

        if (FirebaseManager.instance) {
            FirebaseManager.instance.signIn(email, pass);
        }
    }

    public onSignUpClicked() {
        let email = this.emailInput.string;
        let pass = this.passwordInput.string;

        if (email === "" || pass === "") {
            cc.warn("請輸入帳號和密碼！");
            return;
        }

        if (FirebaseManager.instance) {
            FirebaseManager.instance.signUp(email, pass);
        }
    }

    // ⭐ 新增：綁定給「登出按鈕」的 Click Event
    public onLogoutClicked() {
        if (FirebaseManager.instance) {
            FirebaseManager.instance.signOut();
        }
    }
}