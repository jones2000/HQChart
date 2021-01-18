#pragma once


#ifdef _WIN32
#ifdef HQCHART_DLL_EXPORTS
#define HQCHART_DLL_API extern "C" __declspec(dllexport)
#else
#define HQCHART_DLL_API extern "C" __declspec(dllimport)
#endif
#else
#define HQCHART_DLL_API extern "C"
#endif


#include "HQChart.KLineData.h"

#pragma pack(push,1)

//K线数据
typedef HQChart::Complier::HISTORY_ITEM HQCHART_KDATA;
typedef HQChart::Complier::KDATA_INFO HQCHART_KDATA_INFO;

typedef struct tagHQChartKDataResult
{
	HQCHART_KDATA*	 _pData;
	int				_lCount;
	wchar_t*		_pszName;		//股票名称

	bool			_bResult;
	wchar_t*		_pszError;

	int				_lPeriod;		//周期
	int				_lRight;		//复权

	int				_exData[4];
}HQCHART_KDATA_RESULT, * PHQCHART_KDATA_RESULT;

typedef struct tagValueItem
{
	double  _dValue;
	long	_lDate;
	long	_lTime;
	char	_exData[6];
}VALUE_ITEM, * PVALUE_ITEM;

typedef struct tagHQChartValueResult
{
	int _lType;	//0=单值 1=数组 2=带日期的需要自己拟合数据

	//单值
	double _dValue;

	//数组数据
	VALUE_ITEM* _pData;
	int			_lCount;

	bool		_bResult;
	wchar_t*	_pszError;
}HQCHART_VALUE_RESULT,*PHQCHART_VALUE_RESULT;

typedef struct tagCustomFunctionArgment
{
	double	_dValue[20];
	int		_lCount;
}CUSTOM_FUNCTION_ARGUMENT,*PCUSTOM_FUNCTION_ARGUMENT;

typedef bool(_stdcall *pHQChart_LoadKData)(const wchar_t* lpSymbol, long lPeriod, long lRight, HQCHART_KDATA_RESULT* pResult, const wchar_t* pstrGuid);
typedef bool(_stdcall *pHQChart_LoadKData2)(const wchar_t* lpSymbol, long lPeriod, long lRight, const wchar_t* lpCallInfo, const HQCHART_KDATA_INFO* kDataInfo, HQCHART_KDATA_RESULT* pResult, const wchar_t* pstrGuid);

typedef bool(_stdcall *pHQChart_GetDataByNumber)(const wchar_t* lpSymbol, const wchar_t* pFunctionName, long lParam, long lPeriod, long lRight, const HQCHART_KDATA_INFO* pKDataInfo, HQCHART_VALUE_RESULT* pResult, const wchar_t* pstrGuid);
typedef bool(_stdcall *pHQChart_GetDataByNumbers)(const wchar_t* lpSymbol, const wchar_t* pFunctionName, const CUSTOM_FUNCTION_ARGUMENT* pArgument,  long lPeriod, long lRight, const HQCHART_KDATA_INFO* pKDataInfo, HQCHART_VALUE_RESULT* pResult, const wchar_t* pstrGuid);
typedef bool(_stdcall *pHQChart_GetDataByName)(const wchar_t* lpSymbol, const wchar_t* pFunctionName, long lPeriod, long lRight, const HQCHART_KDATA_INFO* pKDataInfo, HQCHART_VALUE_RESULT* pResult, const wchar_t* pstrGuid);

typedef const wchar_t* (_stdcall* pHQChart_GetIndexScript)(const wchar_t* lpName, const wchar_t* lpCallInfo, const wchar_t* pstrGuid);

typedef void(_stdcall *pHQChart_Success)(const wchar_t* lpSymbol, const wchar_t* lpJSResul, const wchar_t* pstrGuidt);
typedef void(_stdcall *pHQChart_Failed)(const wchar_t* lpCode, const wchar_t* lpSymbol, const wchar_t* lpError, const wchar_t* pstrGuid);


typedef bool(_stdcall* pHQChart_Test)(const wchar_t* lpSymbol);


typedef struct HQCHART_CALLBACK_PTR
{
	pHQChart_LoadKData			_pLoadKData;
	pHQChart_LoadKData2			_pLoadKData2;

	pHQChart_GetDataByNumber	_pGetDataByNumber;
	pHQChart_GetDataByNumbers	_pGetDataByNumbers;
	pHQChart_GetDataByName		_pGetDataByName;
	pHQChart_GetIndexScript		_pGetIndexScript;
	pHQChart_Success			_pSuccess;
	pHQChart_Failed				_pFailed;

	pHQChart_Test				_pTest;

}HQCHART_CALLBACK_PTR,*PHQCHART_CALLBACK_PTR;

#pragma pack(pop)

HQCHART_DLL_API bool __stdcall Run(const wchar_t* pJonsConfig, HQCHART_CALLBACK_PTR callback);
HQCHART_DLL_API bool __stdcall Authorize(const wchar_t* pContent);	//授权
HQCHART_DLL_API const wchar_t* __stdcall GetAuthorizeError();
HQCHART_DLL_API int __stdcall MainVersion();
HQCHART_DLL_API int __stdcall MinVersion();
HQCHART_DLL_API const wchar_t* __stdcall GenerateAuthorize(const wchar_t* pStrKey, const wchar_t* pStrContent);



