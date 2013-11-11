# Autoconf
AC_PREEQ([2.68])
AC_CONFIG_MACRO_DIR([build])
AC_CONFIG_AUX_DIR([build])

# Version
m4_define([aikos_major_version], [0])
m4_define([aikos_minor_version], [0])
m4_define([aikos_micro_version], [2])
m4_define([aikos_version],
          [aikos_major_version.aikos_minor_version.aikos_micro_version])

AC_SUBST([AIKOS_VERSION_MAJOR], [aikos_major_version])
AC_SUBST([AIKOS_VERSION_MINOR], [aikos_minor_version])
AC_SUBST([AIKOS_VERSION_MICRO], [aikos_micro_version])
AC_SUBST([AIKOS_VERSION], [aikos_version])

AC_INIT([aikos],
	[aikos_version],
	[chrisc.101@gmail.com])

# Set prefix
if test "x$prefix" = "xNONE" ; then
  prefix="/usr/local"
fi
if test "x$exec_prefix" = "xNONE" ; then
  exec_prefix=$prefix
fi
PREFIX=$prefix
AC_SUBST([PREFIX])

# Check for install
AC_PROG_INSTALL

# Check for mkdir -p
AC_PROG_MKDIR_P

# Automake
AM_INIT_AUTOMAKE([1.11 foreign -Wall -Werror -Wno-portability])
AM_SILENT_RULES([yes])

AC_OUTPUT([
	Makefile
	www/Makefile
	www/css/Makefile
])
