/********************************************************************************
 *  版本信息输出
 * 
 */



var HQCHART_VERSION="1.1.13696";

function PrintHQChartVersion()
{
    var log=
`*************************************************************************************************************
*
*   HQChart                                             Ver: ${HQCHART_VERSION} 
*                             
*   License: Apache License 2.0                                                                              
*   Source: https://github.com/jones2000/HQChart
*
*************************************************************************************************************
`

    console.log(log);
}


PrintHQChartVersion();


export
{
    HQCHART_VERSION
}



