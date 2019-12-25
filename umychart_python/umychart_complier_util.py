#   Copyright (c) 2018 jones
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
#   开源项目 https://github.com/jones2000/HQChart
#
#   jones_2000@163.com


###########################################################################
#
#
#
##########################################################################

import sys

#不同版本字符串操作函数
PY3 = sys.version_info >= (3, 0)
print ('[UMyChart.Complier] only support pythone 3. current version is ', sys.version_info)

if PY3: # Python 3:
    basestring = str
    long = int
    xrange = range
    unicode = str
    uchr = chr

    def uord(ch):
        return ord(ch[0])