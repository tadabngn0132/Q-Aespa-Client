import { questionApi } from "./questionApi";
import { answerApi } from "./answerApi";
import { authApi } from "./authApi";
import { tagApi } from "./tagApi";
import { userApi } from "./userApi";
import { voteApi } from "./voteApi";

export default {
    questions: questionApi,
    answers: answerApi,
    auths: authApi,
    tags: tagApi,
    users: userApi,
    votes: voteApi
};