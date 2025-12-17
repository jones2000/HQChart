

class EnvironmentVariable
{
    static TargetExtensionID="ephokbeacgjbmodlebliolkjnmcddojn";
    static ClientName="HQChartWSClient_1";

    static EXTENSION_ID_KEY = 'TargetExtensionID';

    static Load()
    {
        const value = localStorage.getItem(EnvironmentVariable.EXTENSION_ID_KEY);
        if (value) EnvironmentVariable.TargetExtensionID=value;
    }

    static Save()
    {
        // 保存到本地 localStorage
        localStorage.setItem(EnvironmentVariable.EXTENSION_ID_KEY, EnvironmentVariable.TargetExtensionID);
    }
}