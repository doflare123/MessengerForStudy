import LoginCheck from './login.js';
import RegisterCheck from "./register.js";
import ChekAllChats from "./AllChatsShow.js";
import SearchAllMesseges from "./AllMesseges.js"
import Sentmess from "./SendMess.js";
import SearchUsers from "./SearchUsers.js";
import UserName from "./ChangeUserName.js"
import UserPass from './ChangeUserPass.js';
import CheckEmail from './checkEmail.js';
import CheckCode from './checkCode.js';
import DeleteUser from './DeleteUser.js';
import ChangeUserAvatar from './ChangeUserAvatar.js';
import checkEmailForgive from './checkEmailForgive.js';
import checkCodeForgive from './checkCodeForgive.js';
import ChangePassFogive from './ChangePassFogive.js';

const messageHandlers = {
    login: LoginCheck,
    register: RegisterCheck,
    Alldialogs: ChekAllChats,
    AllMesseges: SearchAllMesseges,
    NewMessage: Sentmess,
    SearchUser: SearchUsers,
    ChangeName: UserName,
    ChangePass: UserPass,
    CheckCode: CheckCode,
    CheckEmail: CheckEmail,
    DelUser: DeleteUser,
    ChangeUserAvatar: ChangeUserAvatar,
    checkEmailForgive: checkEmailForgive,
    checkCodeForgive: checkCodeForgive,
    ChangePassFogive: ChangePassFogive,
};

export default messageHandlers;