// Copyright (c) 2017Äê BaYiLaoYe. All rights reserved.
// Created By BaYiLaoYe

// Auto Generated. DO NOT EDIT!!!

#ifndef __prototab_h__
#define __prototab_h__

#include "tabledef.h"

class ProtoTab
{
public:
	bool init();
	int getsVal(const char* buf, char* sVal, int valLen);
	static ProtoTab* instance();
	static void clear();

	static void*	SkllFragment_config_list;
	static int32_t SkllFragment_config_list_size;
	static FastProto::SkllFragment_config* get_SkllFragment_config(int key);
	static FastProto::SkllFragment_config* get_SkllFragment_config_byindex(int index);

	static void*	Skll_config_list;
	static int32_t Skll_config_list_size;
	static FastProto::Skll_config* get_Skll_config(int key);
	static FastProto::Skll_config* get_Skll_config_byindex(int index);

private:
	static ProtoTab* m_pInstance;
};

extern ProtoTab* g_pProtoTab;

#endif //__prototab_h__


