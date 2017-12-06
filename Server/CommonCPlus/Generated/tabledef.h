// Copyright (c) 2017�� BaYiLaoYe. All rights reserved.
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
	int	entry;		//����Ƭ��ID
	int	SkllLogic;		//�����߼�
	int	SkllParameter1;		//���ܲ���1
	int	SkllParameter2;		//���ܲ���2
	int	SkllParameter3;		//���ܲ���3
	int	SkllParameter4;		//���ܲ���4
	int	SkllParameter5;		//���ܲ���5
	int	SkllParameter6;		//���ܲ���6
	int	SkllParameter7;		//���ܲ���7
	int	SkllParameter8;		//���ܲ���8
	int	SkllParameter9;		//���ܲ���9
	int	SkllParameter10;		//���ܲ���10
	int	SkllParameter11;		//���ܲ���11
	int	SkllParameter12;		//���ܲ���12
	int	SkllParameter13;		//���ܲ���13
	int	SkllParameter14;		//���ܲ���14
	int	SkllParameter15;		//���ܲ���15

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
	int	entry;		//����ID
	int	ActionId;		//����ID
	int	NeedTime;		//ʩ��ʱ��
	int	Type;		//������������
	int	Consume;		//��������
	int	SameType;		//��ͬ��������ID����Ч
	int	SkllFragmentId1;		//����Ƭ��ID1
	int	SkllFragmentId2;		//����Ƭ��ID2
	int	SkllFragmentId3;		//����Ƭ��ID3
	int	SkllFragmentId4;		//����Ƭ��ID4
	int	SkllFragmentId5;		//����Ƭ��ID5

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

