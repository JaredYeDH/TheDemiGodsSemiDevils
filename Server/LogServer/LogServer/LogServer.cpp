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

