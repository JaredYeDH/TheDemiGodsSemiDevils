// Copyright (c) 2017年 BaYiLaoYe. All rights reserved.
// Created By BaYiLaoYe

// Auto Generated. DO NOT EDIT!!!

#include <string.h>
#include <stdlib.h>
#include <iostream>
#include <map>
#include "tabledef.h"
#include "table.h"
ProtoTab* ProtoTab::m_pInstance=NULL;
ProtoTab* g_pProtoTab=NULL;

ProtoTab* ProtoTab::instance()
{
	if (NULL == m_pInstance)
	{
		m_pInstance = new ProtoTab();
	}
	return m_pInstance;
}

int ProtoTab::getsVal(const char* buf, char* sVal, int valLen)
{
	if (NULL == buf || NULL == sVal)
		return 0;
	memset(sVal, 0, valLen);
	int idx=0, n=0;
	while ('\r' != buf[idx] && '\n' != buf[idx] && n < valLen)
	{
		if ('\t' == buf[idx])
		{
			idx++;
			return idx;
		}
		sVal[n] = buf[idx];
		n++;
		idx++;
	}
	return idx;
}

void ProtoTab::clear()
{
	std::map<int, FastProto::SkllFragment_config*>::iterator	SkllFragment_config_iter=(*(std::map<int, FastProto::SkllFragment_config*>*)ProtoTab::SkllFragment_config_list).begin();
	for (;SkllFragment_config_iter!=(*(std::map<int, FastProto::SkllFragment_config*>*)ProtoTab::SkllFragment_config_list).end();SkllFragment_config_iter++)
		 if (SkllFragment_config_iter->second!=NULL)	delete SkllFragment_config_iter->second;
	delete (std::map<int, FastProto::SkllFragment_config*>*)SkllFragment_config_list;
	std::map<int, FastProto::Skll_config*>::iterator	Skll_config_iter=(*(std::map<int, FastProto::Skll_config*>*)ProtoTab::Skll_config_list).begin();
	for (;Skll_config_iter!=(*(std::map<int, FastProto::Skll_config*>*)ProtoTab::Skll_config_list).end();Skll_config_iter++)
		 if (Skll_config_iter->second!=NULL)	delete Skll_config_iter->second;
	delete (std::map<int, FastProto::Skll_config*>*)Skll_config_list;
	if (NULL != m_pInstance) { delete m_pInstance; m_pInstance = NULL; }
}


bool load_SkllFragment_config()
{
	char buf[MAX_VAL_BUF_LEN]={0};
	FILE *fp = NULL;
	if ((fp = fopen("./Configs/SkllFragment_config.tsv", "rb")) == NULL)
	{
		std::cerr << "ERROR!no find SkllFragment_config.tsv!" << std::endl;
		return false;
	}

	int nRow=0;
	fgets(buf, MAX_VAL_BUF_LEN, fp); // 第一行过滤
	while (NULL != fgets(buf, MAX_VAL_BUF_LEN, fp))
	{
		char val[MAX_VAL_BUF_LEN]={0};
		g_pProtoTab->getsVal(&buf[0], val, sizeof(val));
		if (0 != strcmp(val, "")) nRow++;
	}
	rewind(fp);

	ProtoTab::SkllFragment_config_list_size = nRow;
	if (0 >= ProtoTab::SkllFragment_config_list_size)
	{
		std::cout << "INFO:SkllFragment_config.tsv no data!" << std::endl;
		fclose(fp);
		return true;
	}

	FastProto::SkllFragment_config* tabList = new FastProto::SkllFragment_config[ProtoTab::SkllFragment_config_list_size];
	if (NULL == tabList)
	{
		std::cerr << "ERROR!not enough memory! At loading SkllFragment_config.tsv!" << std::endl;;
		fclose(fp);
		return false;
	}

	fgets(buf, MAX_VAL_BUF_LEN, fp); // 第一行过滤
	int index = 0;
	while (NULL != fgets(buf, MAX_VAL_BUF_LEN, fp) && index < ProtoTab::SkllFragment_config_list_size)
	{
		if (buf[0] == '#')
			continue;

		int idx=0;
		char val[MAX_VAL_BUF_LEN]={0};

		FastProto::SkllFragment_config* tabNote = tabList+index;

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->entry = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllLogic = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter1 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter2 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter3 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter4 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter5 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter6 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter7 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter8 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter9 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter10 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter11 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter12 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter13 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter14 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllParameter15 = atoi(val);

		if (NULL != ProtoTab::get_SkllFragment_config(tabNote->entry))
		{
			std::cerr << "ERROR! duplicate key in SkllFragment_config.tsv! key =" << tabNote->entry << std::endl;
			fclose(fp);
			return false;
		}
		(*(std::map<int, FastProto::SkllFragment_config*>*)ProtoTab::SkllFragment_config_list).insert(std::pair<int, FastProto::SkllFragment_config*>(tabNote->entry, tabNote));
		index ++;
	}
	fclose(fp);
	return true;
}

void* ProtoTab::SkllFragment_config_list=new std::map<int, FastProto::SkllFragment_config*>;
int32_t ProtoTab::SkllFragment_config_list_size=0;

FastProto::SkllFragment_config* ProtoTab::get_SkllFragment_config(int key)
{ 
	std::map<int, FastProto::SkllFragment_config*>::iterator	iter = (*(std::map<int, FastProto::SkllFragment_config*>*)ProtoTab::SkllFragment_config_list).find(key);
	if (iter ==  (*(std::map<int, FastProto::SkllFragment_config*>*)ProtoTab::SkllFragment_config_list).end())
		return NULL;
	return iter->second;
}

FastProto::SkllFragment_config* ProtoTab::get_SkllFragment_config_byindex(int index)
{ 
	if (index >= ProtoTab::SkllFragment_config_list_size)
		return NULL;
	std::map<int, FastProto::SkllFragment_config*>::iterator	iter = (*(std::map<int, FastProto::SkllFragment_config*>*)ProtoTab::SkllFragment_config_list).begin();
	FastProto::SkllFragment_config* ptr = iter->second;
	return (ptr+index);
}


bool load_Skll_config()
{
	char buf[MAX_VAL_BUF_LEN]={0};
	FILE *fp = NULL;
	if ((fp = fopen("./Configs/Skll_config.tsv", "rb")) == NULL)
	{
		std::cerr << "ERROR!no find Skll_config.tsv!" << std::endl;
		return false;
	}

	int nRow=0;
	fgets(buf, MAX_VAL_BUF_LEN, fp); // 第一行过滤
	while (NULL != fgets(buf, MAX_VAL_BUF_LEN, fp))
	{
		char val[MAX_VAL_BUF_LEN]={0};
		g_pProtoTab->getsVal(&buf[0], val, sizeof(val));
		if (0 != strcmp(val, "")) nRow++;
	}
	rewind(fp);

	ProtoTab::Skll_config_list_size = nRow;
	if (0 >= ProtoTab::Skll_config_list_size)
	{
		std::cout << "INFO:Skll_config.tsv no data!" << std::endl;
		fclose(fp);
		return true;
	}

	FastProto::Skll_config* tabList = new FastProto::Skll_config[ProtoTab::Skll_config_list_size];
	if (NULL == tabList)
	{
		std::cerr << "ERROR!not enough memory! At loading Skll_config.tsv!" << std::endl;;
		fclose(fp);
		return false;
	}

	fgets(buf, MAX_VAL_BUF_LEN, fp); // 第一行过滤
	int index = 0;
	while (NULL != fgets(buf, MAX_VAL_BUF_LEN, fp) && index < ProtoTab::Skll_config_list_size)
	{
		if (buf[0] == '#')
			continue;

		int idx=0;
		char val[MAX_VAL_BUF_LEN]={0};

		FastProto::Skll_config* tabNote = tabList+index;

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->entry = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->ActionId = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->NeedTime = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->Type = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->Consume = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SameType = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllFragmentId1 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllFragmentId2 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllFragmentId3 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllFragmentId4 = atoi(val);

		idx += g_pProtoTab->getsVal(&buf[idx], val, sizeof(val));
		if (val[0] != 0)
			tabNote->SkllFragmentId5 = atoi(val);

		if (NULL != ProtoTab::get_Skll_config(tabNote->entry))
		{
			std::cerr << "ERROR! duplicate key in Skll_config.tsv! key =" << tabNote->entry << std::endl;
			fclose(fp);
			return false;
		}
		(*(std::map<int, FastProto::Skll_config*>*)ProtoTab::Skll_config_list).insert(std::pair<int, FastProto::Skll_config*>(tabNote->entry, tabNote));
		index ++;
	}
	fclose(fp);
	return true;
}

void* ProtoTab::Skll_config_list=new std::map<int, FastProto::Skll_config*>;
int32_t ProtoTab::Skll_config_list_size=0;

FastProto::Skll_config* ProtoTab::get_Skll_config(int key)
{ 
	std::map<int, FastProto::Skll_config*>::iterator	iter = (*(std::map<int, FastProto::Skll_config*>*)ProtoTab::Skll_config_list).find(key);
	if (iter ==  (*(std::map<int, FastProto::Skll_config*>*)ProtoTab::Skll_config_list).end())
		return NULL;
	return iter->second;
}

FastProto::Skll_config* ProtoTab::get_Skll_config_byindex(int index)
{ 
	if (index >= ProtoTab::Skll_config_list_size)
		return NULL;
	std::map<int, FastProto::Skll_config*>::iterator	iter = (*(std::map<int, FastProto::Skll_config*>*)ProtoTab::Skll_config_list).begin();
	FastProto::Skll_config* ptr = iter->second;
	return (ptr+index);
}


bool ProtoTab::init()
{
	int res=0;
	res += (load_SkllFragment_config() == false ? 1 : 0);
	res += (load_Skll_config() == false ? 1 : 0);
	return (0 == res);
}
