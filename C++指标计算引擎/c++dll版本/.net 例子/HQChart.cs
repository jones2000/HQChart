//c++调试用宏
//# define __DEBUG__

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;


namespace HQChart.Interface
{
    /// <summary>
    /// K线数据结构
    /// </summary>
    [StructLayoutAttribute(LayoutKind.Sequential, Pack = 1)]
    public struct HQCHART_KDATA
    {
        /// int
        public int _nDate;

        /// int
        public int _nTime;

        /// double
        public double _dYClose;

        /// double
        public double _dOpen;

        /// double
        public double _dHigh;

        /// double
        public double _dLow;

        /// double
        public double _dClose;

        /// double
        public double _dVol;

        /// double
        public double _dAmount;

        /// int
        public int _nAdvance;

        /// int
        public int _nDecline;
    }

    /// <summary>
    /// K线信息
    /// </summary>
    [StructLayoutAttribute(LayoutKind.Sequential, Pack = 1)]
    public struct HQCHART_KDATA_INFO
    {

        /// int
        public int _lPeriod;

        /// int
        public int _lRight;

        /// int
        public int _lStartDate;

        /// int
        public int _lStartTime;

        /// int
        public int _lEndDate;

        /// int
        public int _lEndTime;

        /// int
        public int _lCount;
    }

    /// <summary>
    /// 单个股票的K线数据
    /// </summary>
    [StructLayout(LayoutKind.Sequential,  Pack = 1)]
    public struct HQCHART_KDATA_RESULT
    {
        /// HQCHART_KDATA*
        public System.IntPtr _pData;

        /// int
        public int _lCount;

        /// wchar_t*
        public IntPtr _pszName;

        /// boolean
        [MarshalAs(UnmanagedType.I1)]
        public bool _bResult;

        /// wchar_t*
        public IntPtr _pszError;

        /// int
        public int _lPeriod;

        /// int
        public int _lRight;

        /// <summary>
        /// 扩展信息
        /// </summary>
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = 4, ArraySubType = UnmanagedType.I4)]
        public int[] _exData;
    }

    /// <summary>
    /// 单值数据
    /// </summary>
    [StructLayoutAttribute(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    public struct VALUE_ITEM
    {
        /// double
        public double _dValue;

        /// int
        public int _lDate;

        /// int
        public int _lTime;

        /// char[6]
        [System.Runtime.InteropServices.MarshalAsAttribute(System.Runtime.InteropServices.UnmanagedType.ByValTStr, SizeConst = 6)]
        public string _exData;
    }

    /// <summary>
    /// 获取单值
    /// </summary>
    [StructLayoutAttribute(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    public struct HQCHART_VALUE_RESULT
    {
        /// int
        public int _lType;

        /// double
        public double _dValue;

        /// VALUE_ITEM*
        public System.IntPtr _pData;

        /// int
        public int _lCount;

        /// boolean
        [MarshalAs(UnmanagedType.I1)]
        public bool _bResult;

        /// wchar_t*
        public IntPtr _szError;
    }


    [StructLayoutAttribute(LayoutKind.Sequential,Pack = 1)]
    public struct CUSTOM_FUNCTION_ARGUMENT
    {

        /// double[20]
        [MarshalAsAttribute(UnmanagedType.ByValArray, SizeConst = 20, ArraySubType = UnmanagedType.R8)]
        public double[] _dValue;

        /// int
        public int _lCount;
    }




    public delegate void pHQChart_Success([InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpSymbol, 
        [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpJSResul, 
        [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pstrGuidt);


    public delegate void pHQChart_Failed([InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpCode, 
        [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpSymbol,
        [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpError,
        [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pstrGuid);


    //[UnmanagedFunctionPointerAttribute(CallingConvention.StdCall, CharSet = CharSet.Unicode)]
    public delegate bool pHQChart_LoadKData([InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpSymbol, int lPeriod, int lRight, 
        ref HQCHART_KDATA_RESULT pResult, [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pstrGuid);

    public delegate bool pHQChart_LoadKData2([InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpSymbol, int lPeriod, int lRight, [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpCallInfo,
        ref HQCHART_KDATA_INFO kDataInfo, ref HQCHART_KDATA_RESULT pResult, [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pstrGuid);

    public delegate bool pHQChart_GetDataByNumber([InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpSymbol, 
        [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pFunctionName, int lParam, int lPeriod, int lRight, ref HQCHART_KDATA_INFO kDataInfo, 
        ref HQCHART_VALUE_RESULT pResult, [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pstrGuid);

    public delegate bool pHQChart_GetDataByNumbers([InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpSymbol,
        [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pFunctionName, ref CUSTOM_FUNCTION_ARGUMENT argument, int lPeriod, int lRight, ref HQCHART_KDATA_INFO kDataInfo,
        ref HQCHART_VALUE_RESULT pResult, [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pstrGuid);

    public delegate bool pHQChart_GetDataByName([InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string lpSymbol,
        [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pFunctionName, int lPeriod, int lRight, ref HQCHART_KDATA_INFO kDataInfo, 
        ref HQCHART_VALUE_RESULT pResult, [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pstrGuid);

    public delegate IntPtr pHQChart_GetIndexScript([MarshalAs(UnmanagedType.LPWStr)] string lpName, [MarshalAs(UnmanagedType.LPWStr)] string lpCallInfo, [MarshalAs(UnmanagedType.LPWStr)] string pstrGuid);


    public delegate bool pHQChart_Text([MarshalAs(UnmanagedType.LPWStr)] string lpSymbol);


    [StructLayoutAttribute(LayoutKind.Sequential, Pack =1)]
    public struct HQCHART_CALLBACK_PTR
    {

        /// pHQChart_LoadKData
        public pHQChart_LoadKData _pLoadKData;

        /// pHQChart_LoadKData2
        public pHQChart_LoadKData2 _pLoadKData2;

        /// pHQChart_GetDataByNumber
        public pHQChart_GetDataByNumber _pGetDataByNumber;

        public pHQChart_GetDataByNumbers _pGetDataByNumbers;

        /// pHQChart_GetDataByName
        public pHQChart_GetDataByName _pGetDataByName;

        /// pHQChart_GetIndexScript
        public pHQChart_GetIndexScript _pGetIndexScript;

        /// pHQChart_Success
        public pHQChart_Success _pSuccess;

        /// pHQChart_Failed
        public pHQChart_Failed _pFailed;

        /// <summary>
        /// 测试接口
        /// </summary>
        public pHQChart_Text _pTest;

        
    }

    /// <summary>
    /// dll接口
    /// </summary>
    public class HQChartDll
    {
#if __DEBUG__
        [DllImport(@"D:\Code\Zealink\hqchart.complier\HQChart_Dll\x64\Debug\HQChart_Dll.dll", EntryPoint = "Run")]
#else
        [DllImport(@"HQChart_Dll.dll", EntryPoint = "Run")]
#endif
        [return: MarshalAs(UnmanagedType.I1)]
        public extern static bool Run([InAttribute()][MarshalAs(UnmanagedType.LPWStr)] string pJonsConfig, HQCHART_CALLBACK_PTR callback);

#if __DEBUG__
        [DllImport(@"D:\Code\Zealink\hqchart.complier\HQChart_Dll\x64\Debug\HQChart_Dll.dll", EntryPoint = "MainVersion")]
#else
        [DllImport(@"HQChart_Dll.dll", EntryPoint = "MainVersion")]
#endif
        public static extern int MainVersion();

#if __DEBUG__
        [DllImport(@"D:\Code\Zealink\hqchart.complier\HQChart_Dll\x64\Debug\HQChart_Dll.dll", EntryPoint = "MinVersion")]
#else
        [DllImport(@"HQChart_Dll.dll", EntryPoint = "MinVersion")]
#endif
        public static extern int MinVersion();

#if __DEBUG__
        [DllImport(@"D:\Code\Zealink\hqchart.complier\HQChart_Dll\x64\Debug\HQChart_Dll.dll", EntryPoint = "Authorize")]
#else
        [DllImport(@"HQChart_Dll.dll", EntryPoint = "Authorize")]
#endif
        [return: MarshalAs(UnmanagedType.I1)]
        public extern static bool Authorize([InAttribute()][MarshalAs(UnmanagedType.LPWStr)] string pContent);

#if __DEBUG__
        [DllImport(@"D:\Code\Zealink\hqchart.complier\HQChart_Dll\x64\Debug\HQChart_Dll.dll", EntryPoint = "GetAuthorizeError", CharSet = CharSet.Unicode)]
#else
        [DllImport(@"HQChart_Dll.dll", EntryPoint = "GetAuthorizeError", CharSet = CharSet.Unicode)]
#endif
        public static extern System.IntPtr GetAuthorizeError();


#if __DEBUG__
        [DllImport(@"D:\Code\Zealink\hqchart.complier\HQChart_Dll\x64\Debug\HQChart_Dll.dll", EntryPoint = "GenerateAuthorize", CharSet = CharSet.Unicode)]
#else
        [DllImport(@"HQChart_Dll.dll", EntryPoint = "GenerateAuthorize", CharSet = CharSet.Unicode)]
#endif
        public static extern System.IntPtr GenerateAuthorize([InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pStrKey, [InAttribute()][MarshalAsAttribute(UnmanagedType.LPWStr)] string pStrContent);


    }

    /// <summary>
    /// 数据接口类
    /// </summary>
    public interface IHQChartData
    {
        bool LoadKData(string lpSymbol, int lPeriod, int lRight, ref HQCHART_KDATA_RESULT pResult, string pstrGuid);
        bool LoadKData2(string lpSymbol, int lPeriod, int lRight, string lpCallInfo, ref HQCHART_KDATA_INFO kDataInfo, ref HQCHART_KDATA_RESULT pResult, string pstrGuid);

        bool GetDataByNumber(string lpSymbol, string pFunctionName, int lParam, int lPeriod, int lRight, ref HQCHART_KDATA_INFO kDataInfo, ref HQCHART_VALUE_RESULT pResult, string pstrGuid);
        bool GetDataByNumbers(string lpSymbol, string pFunctionName, ref CUSTOM_FUNCTION_ARGUMENT argument, int lPeriod, int lRight, ref HQCHART_KDATA_INFO kDataInfo, ref HQCHART_VALUE_RESULT pResult, string pstrGuid);
        bool GetDataByName(string lpSymbol, string pFunctionName, int lPeriod, int lRight, ref HQCHART_KDATA_INFO kDataInfo, ref HQCHART_VALUE_RESULT pResult, string pstrGuid);

        IntPtr GetIndexScript(string lpName, string lpCallInfo, string pstrGuid);

    }

    /// <summary>
    /// 数据结果类
    /// </summary>
    public interface IHQChartResult
    {
        void pHQChart_Success(string lpSymbol, string lpJSResult, string pstrGuid);

        void pHQChart_Failed(string lpCode, string lpSymbol, string lpError, string pstrGuid);
    }

    /// <summary>
    /// 参数
    /// </summary>
    public class ArgmentItem
    {
        /// <summary>
        /// 参数名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 参数值
        /// </summary>
        public double Value { get; set; }
    }

    /// <summary>
    /// 
    /// </summary>
    public class RunConfigBase
    {
        /// <summary>
        /// 指标脚本
        /// </summary>
        public string Script { get; set; }
        /// <summary>
        /// 指标参数
        /// </summary>
        public List<ArgmentItem> Args { get; set; }
        /// <summary>
        /// 周期 
        /// 0=日线 1=周线 2=月线 3=年线 9=季线
        /// 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟 11=120分钟 12=240分钟
        /// </summary>
        public int Period { get; set; }
        /// <summary>
        /// 0 不复权 1 前复权 2 后复权
        /// </summary>
        public int Right { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string JobID { get; set; }
        /// <summary>
        /// 输出个数
        /// </summary>
        public int OutCount { get; set; }
    }

    /// <summary>
    /// 单股票策略运行配置
    /// </summary>
    public class RunConfig : RunConfigBase
    {
        /// <summary>
        /// 代码
        /// </summary>
        public string Symbol { get; set; }
    }

    /// <summary>
    /// 多股票策略运行配置
    /// </summary>
    public class RunPolicyConfig : RunConfigBase
    {
        public List<string> Symbol { get; set; }
    }

    /// <summary>
    /// 系统指标
    /// </summary>
    public class IndexScript
    {
        /// <summary>
        /// 指标名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 指标脚本
        /// </summary>
        public string Script { get; set; }
        /// <summary>
        /// 指标参数
        /// </summary>
        public List<ArgmentItem> Args { get; set; }
    }

}
