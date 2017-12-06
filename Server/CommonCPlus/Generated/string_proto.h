#ifndef __svr_string_proto_h
#define __svr_string_proto_h

#include <stdint.h>
#include <stdio.h>

//#define MAX_FIELD_LEN 10
#define MAX_PROTO_STR_LEN 512
#define MAX_PROTO_BIG_STR_LEN (6 * 1024)
namespace FastProto
{
	struct xstring
	{
		char c_str[MAX_PROTO_STR_LEN];

		xstring()
		{
			clear();
		}

		inline void clear()
		{
			c_str[0] = '\0';
		}

		inline bool is_empty() const
		{
			return c_str[0] == '\0';
		}

		inline uint16_t get_str_len() const
		{
			for(uint16_t i = 0; i < MAX_PROTO_STR_LEN; ++i)
			{
				if(c_str[i] == '\0')
					return i;
			}
			return MAX_PROTO_STR_LEN - 1;
		}

		template<class T>
		uint32_t serialize( T& buffer ) const
		{
			uint16_t len = get_str_len();
			uint32_t bytes = 0;
			bytes += buffer << len;
			for (uint16_t i = 0; i < len; ++i)
				bytes += buffer << c_str[i];
			return bytes;
		}

		template<class T>
		uint32_t deserialize( T& buffer )
		{
			uint16_t len = 0;
			uint32_t bytes = 0;
			bytes += buffer >> len;
			if (len >= MAX_PROTO_STR_LEN)
				len = MAX_PROTO_STR_LEN - 1;
			for (uint16_t i = 0; i < len; ++i)
				bytes += buffer >> c_str[i];
			c_str[len] = '\0';
			return bytes;
		}
		inline uint32_t get_size( void ) const
		{
			uint32_t bytes = 0;
			bytes += sizeof(uint16_t);
			bytes += sizeof(char) * get_str_len();
			return bytes;
		}
		inline uint16_t copy_from(const char * src)
		{
			int len = 0;
			for (int i = 0; i < MAX_PROTO_STR_LEN; ++i)
			{
				c_str[i] = src[i];
				len = i;
				if (c_str[i] == '\0')
					break;
			}

			c_str[MAX_PROTO_STR_LEN -1] = '\0';
			return len;
		}

		inline uint16_t copy_from(const xstring src)
		{
			return copy_from(src.c_str);
		}

		inline uint16_t copy_to(char dst[], int dst_len) const
		{
			int src_len = get_str_len();
			int i = 0;
			for (; i < dst_len - 1 && i < src_len; ++i)
				dst[i] = c_str[i];
			dst[i] = '\0';
			dst[dst_len - 1] = '\0';
			return i;
		}

		inline bool is_equal(const xstring& oth_str) const
		{
			return is_equal(oth_str.c_str, MAX_PROTO_STR_LEN);
		}

		inline bool is_equal(const char* oth_str, int max_len) const
		{
			uint16_t len = get_str_len();
			for (int i = 0; i <= len && i < max_len; ++i)
			{
				if (c_str[i] != oth_str[i])
					return false;
			}
			return true;
		}
	};

	struct xbigstring
	{
		char c_str[MAX_PROTO_BIG_STR_LEN];

		xbigstring()
		{
			clear();
		}

		inline void clear()
		{
			c_str[0] = '\0';
		}

		inline bool is_empty() const
		{
			return c_str[0] == '\0';
		}

		inline uint16_t get_str_len() const
		{
			for(uint16_t i = 0; i < MAX_PROTO_BIG_STR_LEN; ++i)
			{
				if(c_str[i] == '\0')
					return i;
			}
			return MAX_PROTO_BIG_STR_LEN;
		}

		template<class T>
		uint32_t serialize( T& buffer ) const
		{
			uint16_t len = get_str_len();
			uint32_t bytes = 0;
			bytes += buffer << len;
			for (uint16_t i = 0; i < len; ++i)
				bytes += buffer << c_str[i];
			return bytes;
		}

		template<class T>
		uint32_t deserialize( T& buffer )
		{
			uint16_t len = 0;
			uint32_t bytes = 0;
			bytes += buffer >> len;
			if (len >= MAX_PROTO_BIG_STR_LEN)
				len = MAX_PROTO_BIG_STR_LEN - 1;
			for (uint16_t i = 0; i < len; ++i)
				bytes += buffer >> c_str[i];
			c_str[len] = '\0';
			return bytes;
		}
		inline uint32_t get_size( void ) const
		{
			uint32_t bytes = 0;
			bytes += sizeof(uint16_t);
			bytes += sizeof(char) * get_str_len();
			return bytes;
		}
		inline uint16_t copy_from(const char * src)
		{
			int len = 0;
			for (int i = 0; i < MAX_PROTO_BIG_STR_LEN; ++i)
			{
				c_str[i] = src[i];
				len = i;
				if (c_str[i] == '\0')
					break;
			}

			c_str[MAX_PROTO_BIG_STR_LEN -1] = '\0';
			return len;
		}

		inline uint16_t copy_from(const xbigstring src)
		{
			return copy_from(src.c_str);
		}

		inline uint16_t copy_to(char dst[], int dst_len)
		{
			int src_len = get_str_len();
			int i = 0;
			for (; i < dst_len - 1 && i < src_len; ++i)
				dst[i] = c_str[i];
			dst[i] = '\0';
			dst[dst_len - 1] = '\0';
			return i;
		}
	};

	struct i_string
	{
		char c_str[MAX_PROTO_BIG_STR_LEN];

		i_string()
		{
			clear();
		}

		inline void clear()
		{
			c_str[0] = '\0';
		}

		inline bool is_empty() const
		{
			return c_str[0] == '\0';
		}

		inline uint32_t get_str_len() const
		{
			for(uint32_t i = 0; i < MAX_PROTO_BIG_STR_LEN; ++i)
			{
				if(c_str[i] == '\0')
					return i;
			}
			return MAX_PROTO_BIG_STR_LEN;
		}

		template<class T>
		uint32_t serialize( T& buffer ) const
		{
			uint32_t len = get_str_len();
			uint32_t bytes = 0;
			bytes += buffer << len;
			for (uint32_t i = 0; i < len; ++i)
				bytes += buffer << c_str[i];
			return bytes;
		}

		template<class T>
		uint32_t deserialize( T& buffer )
		{
			uint32_t len = 0;
			uint32_t bytes = 0;
			bytes += buffer >> len;
			if (len >= MAX_PROTO_BIG_STR_LEN)
				len = MAX_PROTO_BIG_STR_LEN - 1;
			for (uint32_t i = 0; i < len; ++i)
				bytes += buffer >> c_str[i];
			c_str[len] = '\0';
			return bytes;
		}
		inline uint32_t get_size( void ) const
		{
			uint32_t bytes = 0;
			bytes += sizeof(uint32_t);
			bytes += sizeof(char) * get_str_len();
			return bytes;
		}
		inline uint32_t copy_from(const char * src)
		{
			int len = 0;
			for (int i = 0; i < MAX_PROTO_BIG_STR_LEN; ++i)
			{
				c_str[i] = src[i];
				len = i;
				if (c_str[i] == '\0')
					break;
			}

			c_str[MAX_PROTO_BIG_STR_LEN -1] = '\0';
			return len;
		}

		inline uint32_t copy_from(const xbigstring src)
		{
			return copy_from(src.c_str);
		}

		inline uint32_t copy_to(char dst[], int dst_len)
		{
			int src_len = get_str_len();
			int i = 0;
			for (; i < dst_len - 1 && i < src_len; ++i)
				dst[i] = c_str[i];
			dst[i] = '\0';
			dst[dst_len - 1] = '\0';
			return i;
		}

		void print_log(int len, const char *) const
		{
	
		}
	};

};

#endif