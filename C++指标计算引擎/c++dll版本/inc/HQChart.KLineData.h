/*
	Copyright (c) 2018 jones

	http://www.apache.org/licenses/LICENSE-2.0

	开源项目 https://github.com/jones2000/HQChart

	jones_2000@163.com

	股票数据类及对外接口类 (c++)
*/

#pragma once
#include "zwldef.h"
#include <vector>
#include <map>
#include <string>
#include <set>

#ifdef _WIN32
#define REGISTER_HISTORYDATA(__class__)\
	HQChart::Complier::IHistoryData* Create##__class__(const std::wstring& strSymbol, long lPeriod, long lRight)\
	{\
		return new __class__(strSymbol, lPeriod, lRight);\
	}\
	void Delete##__class__(HQChart::Complier::IHistoryData*& pHistoryData)\
	{\
		if (pHistoryData) { delete pHistoryData; pHistoryData = NULL; }\
	}\
	const bool bRegisteredCreate##__class__ = HQChart::Complier::DataCreateFactory::GetInstance().RegisterHistoryData(L#__class__, Create##__class__, Delete##__class__);\


#else
#define REGISTER_HISTORYDATA(__class__)\
	HQChart::Complier::IHistoryData* Create__class__(const std::wstring& strSymbol, long lPeriod, long lRight)\
	{\
		return new __class__(strSymbol, lPeriod, lRight);\
	}\
	void Delete__class__(HQChart::Complier::IHistoryData*& pHistoryData)\
	{\
		if (pHistoryData) { delete pHistoryData; pHistoryData = NULL; }\
	}\
	const bool bRegisteredCreate__class__ = HQChart::Complier::DataCreateFactory::GetInstance().RegisterHistoryData(L"_class__", Create__class__, Delete__class__);\
	
#endif

namespace HQChart { namespace Complier {

#pragma pack(push,1)

struct HISTORY_ITEM
{
	int _nDate=0;		//日期  yyyymmdd
	int _nTime=0;		//时间  hhmmss
	double _dYClose=0;	//算复权用
	double _dOpen=0;
	double _dHigh=0;
	double _dLow=0;
	double _dClose=0;
	double _dVol=0;
	double _dAmount=0;
	int	_nAdvance = 0;	//周期上涨家数. 分笔 B/S
	int _nDecline = 0;	//周期下跌家数.
};

//K线信息
struct KDATA_INFO
{
	long _lPeriod;	//周期
	long _lRight;	//复权

	//起始日期
	long _lStartDate;
	long _lStartTime;

	//结束日期
	long _lEndDate;
	long _lEndTime;

	long _lCount;	//K线个数
};

#pragma pack(pop)

//周期
enum PERIOD_TYPE_ID
{
	PERIOD_DAY_ID=0,
	PERIOD_WEEK_ID=1,
	PERIOD_MONTH_ID=2,
	PERIOD_YEAR_ID=3,
	PERIOD_QUARTER_ID=9,	//季
	PERIOD_TWO_WEEK_ID=21,	//双周

	PERIOD_MIN1_ID=4,
	PERIOD_MIN5_ID=5,
	PERIOD_MIN15_ID=6,
	PERIOD_MIN30_ID=7,
	PERIOD_MIN60_ID=8,

	PERIOD_TICK_ID=10,	//分笔
};

//复权
enum RIGHT_TYPE_ID
{
	RIGHT_NONE_ID = 0, //不复权
	RIGHT_BEFORE_ID = 1,//前复权
	RIGHT_AFTER_ID= 2,  //后复权
};

class Variant;
class Node;
struct FIT_DATETIME_ITEM;

class VariantCacheManage;
class ScriptIndex;
class IHistoryData
{
public:
	IHistoryData();
	virtual ~IHistoryData();

	typedef std::vector<Variant*> ARRAY_VARIANT;
	typedef std::vector<Variant* > ARRAY_CALL_ARGUMENT;
	typedef std::vector<HISTORY_ITEM> ARRAY_KDATA;
	typedef std::vector<FIT_DATETIME_ITEM> ARRAY_FIT_DATETIME_DATA;

	virtual void Initialization(void* pData) = 0;	//初始化
	virtual bool LoadKData() = 0;	//加载K线
	virtual bool LoadKData(const std::wstring& strSymbol, long lPeriod, long lRight, Node* pNode, const std::wstring& strCallInfo) =0;	//K线下载

	virtual Variant* GetClose() const =0;	//收盘价
	virtual Variant* GetOpen() const =0;	//开盘
	virtual Variant* GetHigh() const =0;	//最高
	virtual Variant* GetLow() const =0;		//最低
	virtual Variant* GetVol() const =0;		//量
	virtual Variant* GetAmount() const =0;	//金额
	virtual Variant* GetDate() const = 0;	//日期
	virtual Variant* GetTime() const =0;	//时间
	virtual Variant* GetMonth() const=0;	//月
	virtual Variant* GetDay() const = 0;	//天
	virtual Variant* GetYear() const=0;		//年
	virtual Variant* GetWeekDay() const=0;	//星期几
	virtual Variant* GetHour() const=0;		//小时
	virtual Variant* GetMinute() const=0;	//分钟
	virtual Variant* GetCurrBarsCount() const = 0;	//到最后交易日的周期数
	virtual Variant* GetTotalBarsCount() const = 0;
	virtual Variant* GetFromOpen(Node* pNode) const = 0;
	virtual Variant* GetAdvance() const = 0;
	virtual Variant* GetDecline() const = 0;
	virtual const ARRAY_KDATA* GetKData(const std::wstring& strSymbol, long lPeriod, long lRight) const = 0;
	virtual Variant* GetKDataItem(const ARRAY_KDATA& aryData, const std::wstring& strVarName) const = 0;

	virtual Variant* GetCustomValue(const std::wstring& strName, Node* pNode) const = 0;
	virtual Variant* CallCustomFunction(const std::wstring& strName, const std::vector<double>& args, Node* pNode) const = 0;

	virtual const HISTORY_ITEM* GetKItem(int nIndex) const = 0;	//获取索引对应的K线数据
	virtual long GetKCount() const = 0;
	virtual const bool GetKMaxMin(double& dMax, double& dMin) const = 0;		// 获取K线最大，最小值
	virtual const bool GetKMaxMin(long lStart, long lEnd, double& dMax, double& dMin) const = 0;

	virtual long FindByDate(long lDate) const { return -1; }	//查找某一天K线日期的索引

	virtual Variant* GetBlockMemberCount(const ARRAY_CALL_ARGUMENT& args, Node* pNode) const = 0;	//板块股票个数
	virtual Variant* GetBlockCalculate(const ARRAY_CALL_ARGUMENT& args, Node* pNode) const =0 ;		//多股统计

	//其他行情数据
	virtual Variant* GetFinance(const ARRAY_CALL_ARGUMENT& args, Node* pNode) const = 0;	//财务数据
	virtual Variant* GetCapital(Node* pNode) const = 0;			//CAPITAL 当前流通股本 手
	virtual Variant* GetTotalCaptialAll(Node* pNode) const = 0;	//TOTALCAPITAL  当前总股本 手
	virtual Variant* GetHisCapital(Node* pNode) const = 0;	//历史流通股本 股
	virtual Variant* GetExchange(Node* pNode) const = 0;	//换手率
	virtual Variant* GetDynaInfo(const ARRAY_CALL_ARGUMENT& args, Node* pNode) const = 0;	//个股最新数据
	virtual Variant* GetIndexData(const std::wstring& strName, Node* pNode) const = 0;	//获取大盘数据

	virtual Variant* GetName() const = 0;		//股票名称
	virtual Variant* GetSymbol(long lType) const = 0;		//股票代码
	virtual const std::wstring& GetSymbolString() const = 0;//股票代码
	virtual Variant* GetCategroyName(long lType) const = 0;	//板块名称
	virtual Variant* IsInCategroy(long lType, const std::wstring& strName) const = 0; //是否板块成员
	virtual Variant* GetMarketName() const = 0;	//市场代码
	virtual Variant* GetMarketCNName() const = 0;	//市场名称
	virtual Variant* GetPeriodID() const = 0; //分时线=1,分笔成交=2,1分钟线=3,5分钟线=4,15分钟线=5,30分钟线=6,60分钟线=7,日线=8,周线=9,月线=10,多日线=11,年线=12,季线=13,半年线=14。
	virtual Variant* GetSymbolTypeID() const = 0;
	virtual Variant* GetDrawNULL() const = 0;

	virtual bool GetIndexScript(const std::wstring& strName, const std::wstring& strCallInfo, ScriptIndex& script, Node* pNode) const = 0;	//获取系统指标脚本

	virtual long GetPeriod() const = 0;
	virtual long GetRight() const = 0;

	virtual ARRAY_KDATA& GetData() = 0;
	virtual const ARRAY_KDATA& GetData() const = 0;

	virtual bool IsMinutePeriod() const=0;
	virtual bool IsDayPeriod() const=0;
	virtual bool IsTickPeriod() const = 0;

	virtual bool ConvertToDayPeriod(const ARRAY_KDATA& aryDay, ARRAY_KDATA& dest, long lPeriod) const;
	virtual bool ConvertToMinutePeriod(const ARRAY_KDATA& aryOneMinute, ARRAY_KDATA& dest, long lPeriod) const;
	virtual bool ConvertToRight(ARRAY_KDATA& aryData, long lRight) const;	//复权计算

	inline const std::wstring& GetClassName() const { return m_strClassName; }

	void ClearCache();
	void SetCacheManage(VariantCacheManage* pVariantCacheManage);
	
	static void FitDateTime(const IHistoryData* pDestHistoryData, const IHistoryData* pHistoryData, ARRAY_FIT_DATETIME_DATA& aryDateTime);		//日期拟合 (pDestHistoryData 需要转换的K
	static bool IsMinutePeriod(long lPeriod);
	static bool IsDayPeriod(long lPeriod);
	static bool IsTickPeriod(long lPeriod);
	static bool IsSZSHStock(const std::wstring& strSymbol);	//是否为上海/深证股票
protected:
	Variant* Create() const;
	
	static long GetFriday(long lDate);

	mutable ARRAY_VARIANT m_VariantCache;	//保存所有创建的变量数据
	VariantCacheManage*	m_pVariantCacheManage = NULL;
	std::wstring m_strClassName = L"IHistoryData";
};

class VariantCacheManage
{
public:
	typedef std::vector<Variant*> ARRAY_VARIANT;

	VariantCacheManage();
	~VariantCacheManage();

	Variant* Create();

	void FreeVariant();
	void Clear();

private:
	ARRAY_VARIANT m_aryUsedVariant;
	ARRAY_VARIANT m_aryFreeVariant;
};


#pragma pack(push,1)

struct FINANCE_ITEM
{
	int _nDate;			//日期
	double _dValue;		//某一个财务指标
};

enum FINANCE_ID		//财务数据ID
{
	TOTAL_EQUITY_ID = 0, //总股本
	FLOW_EQUITY_ID=7,	 //流通股本
	SHAREHOLDER_ID=8,	 //股东人数
	AL_RATIO=9,			 //资产负债率(asset-liability ratio)
};

struct HISTORY_EXTEND_ITEM
{
	int _nDate;		//K线日期
	int _nTime = 0;	//K线时间
	double _dValue;	//数据

	int _nExDate;	//对应扩展数据的日期时间 （调试用)
	int _nExTime;
};

struct OVERLAY_HISTORY_ITEM
{
	int _nDate;
	int _nTime = 0;
	double _dYClose=0;	//目前没用到
	double _dOpen;
	double _dHigh;
	double _dLow;
	double _dClose;
	double _dVol;
	double _dAmount;

	int	_nAdvance = 0;	//周期上涨家数.
	int _nDecline = 0;	//周期下跌家数.

	int _nExDate;	//对应扩展数据的日期时间 （调试用)
	int _nExTime;
};

enum DYNAINFO_ID
{
	DYNAINFO_YCLOSE_ID=3,	//前收盘价
	DYNAINFO_OPEN_ID=4,		//开盘价
	DYNAINFO_HIGH_ID=5,		//最高价
	DYNAINFO_LOW_ID=6,		//最低价
	DYNAINFO_PRICE_ID=7,	//现价
	DYNAINFO_VOL_ID=8,		//总量
	DYNAINFO_CVOL_ID=9,		//现量
	DYNAINFO_AMOUNT_ID=10,	//金额
	DYNAINFO_APRICE_ID=11,  //均价
};


#pragma pack(pop)

//行业分类
struct CATEGROY_ITEM
{
	long _lType;			//行业类型
	std::wstring _strName;	//行业名称
	std::wstring _strSymbol;//行业代码
};

struct FIT_DATETIME_ITEM
{
	long _lDate[2];
	long _lTime[2];
	long _lIndex = -1;

	FIT_DATETIME_ITEM()
		:_lIndex(-1)
	{
		_lDate[0] = _lDate[1] = 0;
		_lTime[0] = _lTime[1] = 0;
	}
};


class HistoryDataCache : public IHistoryData
{
public:
	typedef std::vector<HISTORY_ITEM> ARRAY_KDATA;
	typedef std::vector<FINANCE_ITEM> ARRAY_FINANCE_DATA;
	typedef std::vector<HISTORY_EXTEND_ITEM> ARRAY_EXTEND_DATA;
	typedef std::map<long, double> MAP_DYNAINFO_DATA;
	typedef std::vector<OVERLAY_HISTORY_ITEM> ARRAY_OVERLAY_DATA;	//叠加数据
	typedef std::vector<CATEGROY_ITEM> ARRAY_CATEGORY_DATA;			//行业数据

	HistoryDataCache(const std::wstring& strSymbol, long lPeriod, long lRight);
	virtual ~HistoryDataCache();

	virtual void Initialization(void* pData);
	virtual bool LoadKData();							//加载K线
	virtual bool LoadKData(const std::wstring& strSymbol, long lPeriod, long lRight, Node* pNode, const std::wstring& strCallInfo);

	ARRAY_KDATA& GetData() { return m_aryData; };
	const ARRAY_KDATA& GetData() const { return m_aryData; }

	void SetName(const std::wstring& strName) { m_strName = strName; }	//设置股票名称

	virtual const HISTORY_ITEM* GetKItem(int nIndex) const;
	virtual long GetKCount() const;
	virtual const bool GetKMaxMin(double& dMax, double& dMin) const;
	virtual const bool GetKMaxMin(long lStart, long lEnd, double& dMax, double& dMin) const;
	virtual long FindByDate(long lDate) const;

	virtual Variant* GetClose() const;
	virtual Variant* GetOpen() const;
	virtual Variant* GetHigh() const;
	virtual Variant* GetLow() const;
	virtual Variant* GetVol() const;
	virtual Variant* GetAmount() const;
	virtual Variant* GetDate() const;
	virtual Variant* GetTime() const;
	virtual Variant* GetMonth() const;
	virtual Variant* GetYear() const;
	virtual Variant* GetDay() const;
	virtual Variant* GetWeekDay() const;
	virtual Variant* GetHour() const;
	virtual Variant* GetMinute() const;
	virtual Variant* GetCurrBarsCount() const;
	virtual Variant* GetTotalBarsCount() const;
	virtual Variant* GetFromOpen(Node* pNode) const;
	virtual Variant* GetAdvance() const;
	virtual Variant* GetDecline() const;
	virtual Variant* GetCustomValue(const std::wstring& strName, Node* pNode) const;
	virtual Variant* CallCustomFunction(const std::wstring& strName, const std::vector<double>& args, Node* pNode) const;
	virtual const ARRAY_KDATA* GetKData(const std::wstring& strSymbol, long lPeriod, long lRight) const;
	virtual Variant* GetKDataItem(const ARRAY_KDATA& aryData, const std::wstring& strVarName) const;

	virtual Variant* GetFinance(const ARRAY_CALL_ARGUMENT& args, Node* pNode) const;
	virtual Variant* GetExchange(Node* pNode) const;	//换手率
	virtual Variant* GetCapital(Node* pNode) const;		//获取当前的流通股本 单位手
	virtual Variant* GetTotalCaptialAll(Node* pNode) const;	//TOTALCAPITAL  当前总股本 手
	virtual Variant* GetHisCapital(Node* pNode) const;	//获取历史所有的流通股本 单位股
	virtual Variant* GetDynaInfo(const ARRAY_CALL_ARGUMENT& args, Node* pNode) const;
	virtual Variant* GetIndexData(const std::wstring& strName, Node* pNode) const;

	virtual Variant* GetBlockMemberCount(const ARRAY_CALL_ARGUMENT& args, Node* pNode) const;	//板块股票个数
	virtual Variant* GetBlockCalculate(const ARRAY_CALL_ARGUMENT& args, Node* pNode) const;		//多股统计

	virtual Variant* GetName() const;		//股票名称
	virtual Variant* GetSymbol(long lType) const;		//股票代码
	virtual Variant* GetCategroyName(long lType) const;	//板块名称 lType=-1 取所有行业
	virtual Variant* IsInCategroy(long lType, const std::wstring& strName) const;
	virtual Variant* GetMarketName() const;
	virtual Variant* GetMarketCNName() const;
	virtual Variant* GetPeriodID() const; //分时线=1,分笔成交=2,1分钟线=3,5分钟线=4,15分钟线=5,30分钟线=6,60分钟线=7,日线=8,周线=9,月线=10,多日线=11,年线=12,季线=13,半年线=14。
	virtual Variant* GetSymbolTypeID() const;
	virtual Variant* GetDrawNULL() const;

	virtual bool GetIndexScript(const std::wstring& strName, const std::wstring& strCallInfo, ScriptIndex& script, Node* pNode) const;	//获取系统指标脚本

	virtual long GetPeriod() const { return m_lPeriod; }
	virtual long GetRight() const { return m_lRight; }
	virtual bool IsMinutePeriod() const;
	virtual bool IsDayPeriod() const;
	virtual bool IsTickPeriod() const;

	bool IsSH() const;		//上海交易所品种
	bool IsSZ() const;		//深圳交易所品种
	bool IsSHSZA() const;		//上海,深圳A股
	bool IsSHSZIndex() const; //上海,深圳指数

	virtual const std::wstring& GetSymbolString() const { return m_strSymbol; }

	

protected:
	virtual bool LoadFinance(long lType) const;			//加载财务数据 (用到才加载）
	virtual bool LoadDynainfo(long lType) const;		//加载即时行情数据 (用到才加载）
	virtual bool LoadIndexData(const std::wstring& strName, Node* pNode) const;		//加载大盘数据 (用到才加载)
	virtual bool LoadCategoryData() const;				//加载行业分类数据(用到才加载)

	Variant* GetIsPriceDown() const;
	Variant* GetIsPriceUp() const;
	Variant* GetIsPriceEqual() const;

	static void FitExtendData(ARRAY_EXTEND_DATA& dest, const ARRAY_KDATA& kData, const ARRAY_FINANCE_DATA& fData);			//财务数据K线数据拟合
	static void FitExtendData(ARRAY_EXTEND_DATA& dest, const ARRAY_KDATA& kData, long lPeriod, const ARRAY_FINANCE_DATA& fData, double dNUll, bool bExactMatch=true);	///数据和K线数据拟合,不做平滑处理 bExactMatch 精确匹配

	static void FitOveralyDayData(ARRAY_OVERLAY_DATA& dest, const ARRAY_KDATA& kData, const ARRAY_KDATA& overalyData);		//K线叠加拟合
	static void FitOveralyMinuteData(ARRAY_OVERLAY_DATA& dest, const ARRAY_KDATA& kData, const ARRAY_KDATA& overalyData);	//K线叠加拟合
	static int GetWeek(int nDate);

	mutable ARRAY_FINANCE_DATA m_aryFinance;	//财务数据读取缓存
	mutable MAP_DYNAINFO_DATA m_mapDynainfo;	//即时行情数据
	mutable ARRAY_OVERLAY_DATA m_aryIndex;		//大盘数据
	mutable ARRAY_CATEGORY_DATA m_aryCategory;	//行业分类数据

	std::wstring m_strSymbol;					//股票代码
	std::wstring m_strName;						//股票名称

	long m_lPeriod = 0;							//周期 0=日线 1=周线 2=月线 3=年线 4=1分钟 5=5分钟 6=15分钟 7=30分钟 8=60分钟 9=季线 10=分笔
	long m_lRight = 0;							//复权 0=不复权 1=前复权 2=后复权
	ARRAY_KDATA m_aryData;						//K线数据
	KDATA_INFO m_KDataInfo;						//K线信息
	std::map<std::wstring, ARRAY_KDATA>	m_mapKData;	//其他的K线数据
	XINT64 m_lUpdateTime=0;						//最后更新时间
};



typedef IHistoryData* (*pCreateHistoryData)(const std::wstring& strSymbol, long lPeriod, long lRight);	//lPeriod=周期 lRight=复权
typedef void(*pDeleteHistoryData)(IHistoryData*& pHistoryData);

struct CREATE_ITEM
{
	std::wstring _strName;
	pCreateHistoryData _pProcCreate = NULL;
	pDeleteHistoryData _pProcDelete = NULL;
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
// 数据类工厂
//
/////////////////////////////////////////////////////////////////////////////////////////////////////

class DataCreateFactory
{
public:
	static DataCreateFactory& GetInstance();

	bool RegisterHistoryData(const std::wstring& strClassName, pCreateHistoryData pProcCreate, pDeleteHistoryData pProcDelete);

	IHistoryData* CreateHistoryData(const std::wstring& strClassName, const std::wstring& strSymbol, long lPeriod, long lRight);
	bool DeleteHistoryData(const std::wstring& strClassName, IHistoryData*& pHistoryData);

private:
	DataCreateFactory();
	~DataCreateFactory();

	typedef std::map<std::wstring, CREATE_ITEM> MAP_CREATE_DATA;

	MAP_CREATE_DATA m_mapCreateData;

};

class AutoPtrHistoryData
{
public:
	AutoPtrHistoryData(const std::wstring& strClassName);
	~AutoPtrHistoryData();

	IHistoryData* Create(const std::wstring& strSymbol, long lPeriod, long lRight);
	void Release();

private:
	std::wstring m_strClassName;
	IHistoryData* m_pHistoryData=NULL;
};

//////////////////////////////////////////////////////////////////////////////////////////////
//  自定义变量,函数接口
//
//
/////////////////////////////////////////////////////////////////////////////////////////////


struct CUSTOM_FUNCTION_ITEM
{
	std::wstring _strName;		//参数名
	int			_nArgCount;	//参数个数
};

class CustomFunction
{
public:
	static CustomFunction& GetInstance();

	bool Get(const std::wstring& strName, CUSTOM_FUNCTION_ITEM& item);
	void Add(const std::wstring& strName, long lArgCount);

private:
	CustomFunction();
	~CustomFunction();

	std::map<std::wstring, CUSTOM_FUNCTION_ITEM> m_aryCustomFunc;	//自定义函数


};

class CustomVariant
{
public:
	static CustomVariant& GetInstance();

	void Add(const std::wstring& strName);
	bool IsExist(const std::wstring& strName) const;

private:
	CustomVariant();
	~CustomVariant();

	std::set<std::wstring> m_setVariant;
};


}
}