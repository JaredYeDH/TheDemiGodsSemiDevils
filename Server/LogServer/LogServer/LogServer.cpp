// LogServer.cpp : 定义控制台应用程序的入口点。
//

#include "stdafx.h"
#include <iostream>
#include "Net/LogNetSessionMgr.h"
#include "LogHandler.h"
#include "table.h"

int main()
{
	g_pProtoTab = ProtoTab::instance();
	if (!g_pProtoTab->init())
	{
		std::cerr << "ERROR:g_pProtoTab Init FAILED!" << std::endl;
		return 0;
	}
	FastProto::SkllFragment_config* tab = ProtoTab::instance()->get_SkllFragment_config(301); 
	std::cout<< "------ 1  ------:" << tab->entry << std::endl;		//技能片段ID
	std::cout<< "------ 2  ------:" << tab->SkllLogic  << std::endl;		//技能逻辑
	std::cout<< "------ 3  ------:" << tab->SkllParameter1 << std::endl;		//技能参数1
	std::cout<< "------ 4  ------:" << tab->SkllParameter2 << std::endl;		//技能参数2
	std::cout<< "------ 5  ------:" << tab->SkllParameter3 << std::endl;		//技能参数3
	std::cout<< "------ 6  ------:" << tab->SkllParameter4 << std::endl;		//技能参数4
	std::cout<< "------ 7  ------:" << tab->SkllParameter5 << std::endl;		//技能参数5
	std::cout<< "------ 8  ------:" << tab->SkllParameter6 << std::endl;		//技能参数6
	std::cout<< "------ 9  ------:" << tab->SkllParameter7 << std::endl;		//技能参数7
	std::cout<< "------ 10 ------:" << tab->SkllParameter8 << std::endl;		//技能参数8
	std::cout<< "------ 11 ------:" << tab->SkllParameter9 << std::endl;		//技能参数9
	std::cout<< "------ 12 ------:" << tab->SkllParameter10 << std::endl;		//技能参数10
	std::cout<< "------ 13 ------:" << tab->SkllParameter11 << std::endl;		//技能参数11
	std::cout<< "------ 14 ------:" << tab->SkllParameter12 << std::endl;		//技能参数12
	std::cout<< "------ 15 ------:" << tab->SkllParameter13 << std::endl;		//技能参数13
	std::cout<< "------ 16 ------:" << tab->SkllParameter14 << std::endl;		//技能参数14
	std::cout<< "------ 17 ------:" << tab->SkllParameter15 << std::endl;		//技能参数15
	auto res = CLogHandler::GetInstance().Init();
	if (res){
		while(true){
			INetSessionMgr::GetInstance()->Update();
			Sleep(1);
		}
	}

	g_pProtoTab->clear();
	return 0;
}

