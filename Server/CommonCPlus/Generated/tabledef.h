// Copyright (c) 2017年 BaYiLaoYe. All rights reserved.
// Created By BaYiLaoYe

// Auto Generated. DO NOT EDIT!!!

#ifndef __tabledef_h__
#define __tabledef_h__

#include "string_proto.h"

#define MAX_VAL_BUF_LEN (20*1024)
#define MAX_PATH_LEN (256)


namespace FastProto {
typedef struct SkllFragment_config
{
	int	entry;		//技能片段ID
	int	SkllLogic;		//技能逻辑
	int	SkllParameter1;		//技能参数1
	int	SkllParameter2;		//技能参数2
	int	SkllParameter3;		//技能参数3
	int	SkllParameter4;		//技能参数4
	int	SkllParameter5;		//技能参数5
	int	SkllParameter6;		//技能参数6
	int	SkllParameter7;		//技能参数7
	int	SkllParameter8;		//技能参数8
	int	SkllParameter9;		//技能参数9
	int	SkllParameter10;		//技能参数10
	int	SkllParameter11;		//技能参数11
	int	SkllParameter12;		//技能参数12
	int	SkllParameter13;		//技能参数13
	int	SkllParameter14;		//技能参数14
	int	SkllParameter15;		//技能参数15

	SkllFragment_config()
	{
		clear();
	}
	void clear()
	{
		entry = -1;
		SkllLogic = -1;
		SkllParameter1 = -1;
		SkllParameter2 = -1;
		SkllParameter3 = -1;
		SkllParameter4 = -1;
		SkllParameter5 = -1;
		SkllParameter6 = -1;
		SkllParameter7 = -1;
		SkllParameter8 = -1;
		SkllParameter9 = -1;
		SkllParameter10 = -1;
		SkllParameter11 = -1;
		SkllParameter12 = -1;
		SkllParameter13 = -1;
		SkllParameter14 = -1;
		SkllParameter15 = -1;
	}
} SkllFragment_config;

typedef struct Skll_config
{
	int	entry;		//技能ID
	int	ActionId;		//动作ID
	int	NeedTime;		//施法时间
	int	Type;		//技能消耗类型
	int	Consume;		//技能消耗
	int	SameType;		//相同技能类型ID不生效
	int	SkllFragmentId1;		//技能片段ID1
	int	SkllFragmentId2;		//技能片段ID2
	int	SkllFragmentId3;		//技能片段ID3
	int	SkllFragmentId4;		//技能片段ID4
	int	SkllFragmentId5;		//技能片段ID5

	Skll_config()
	{
		clear();
	}
	void clear()
	{
		entry = -1;
		ActionId = -1;
		NeedTime = -1;
		Type = -1;
		Consume = -1;
		SameType = -1;
		SkllFragmentId1 = -1;
		SkllFragmentId2 = -1;
		SkllFragmentId3 = -1;
		SkllFragmentId4 = -1;
		SkllFragmentId5 = -1;
	}
} Skll_config;

}


#endif //__tabledef_h__

