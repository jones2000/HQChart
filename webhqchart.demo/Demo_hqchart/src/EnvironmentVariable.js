

class EnvironmentVariable
{
    static TargetExtensionID="ephokbeacgjbmodlebliolkjnmcddojn";
    static ClientName="HQChartWSClient_1";

    static EXTENSION_ID_KEY = 'TargetExtensionID';

    static COZEAI_BOT_ID_KEY="COZE_BOT_ID";
    static COZEAI_TOKEN_ID_KEY="COZE_TOKEN_ID";

    static CozeAI=
    {
        BotID:"7632366331311996978",
        Token:""
    }

    static Load()
    {
        var value = localStorage.getItem(EnvironmentVariable.EXTENSION_ID_KEY);
        if (value) EnvironmentVariable.TargetExtensionID=value;

        value = localStorage.getItem(EnvironmentVariable.COZEAI_BOT_ID_KEY);
        if (value) EnvironmentVariable.CozeAI.BotID=value;

        value = localStorage.getItem(EnvironmentVariable.COZEAI_TOKEN_ID_KEY);
        if (value) EnvironmentVariable.CozeAI.Token=value;
    }

    static Save()
    {
        // 保存到本地 localStorage
        localStorage.setItem(EnvironmentVariable.EXTENSION_ID_KEY, EnvironmentVariable.TargetExtensionID);
        localStorage.setItem(EnvironmentVariable.COZEAI_BOT_ID_KEY, EnvironmentVariable.CozeAI.BotID);
        localStorage.setItem(EnvironmentVariable.COZEAI_TOKEN_ID_KEY, EnvironmentVariable.CozeAI.Token);
    }
}