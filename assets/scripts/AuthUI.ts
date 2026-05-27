import FirebaseManager from "./FirebaseManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AuthUI extends cc.Component {

    @property(cc.EditBox)
    emailInput: cc.EditBox = null;

    @property(cc.EditBox)
    passwordInput: cc.EditBox = null;

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
}