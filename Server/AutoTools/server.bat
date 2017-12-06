@echo off
pushd bin

gen_tsv.exe ..\..\..\..\CodeNone\Design\Public\Table\ ..\Configs
del ..\..\Bin\x64\Release\Configs\*.tsv
copy ..\Configs\*.tsv ..\..\Bin\x64\Release\Configs\ /Y
table_conv.exe ..\Configs\ ..\..\CommonCPlus\Generated\
del ..\Configs\*.tsv

popd
pause